// DEV-only harness (PRD §6.10 / ADR-075): the in-UI DEV panel + the live variant-toggle
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
// prod flag-debt (ADR-075).

import {
  balance,
  bestiaryEntries,
  canBuy,
  formatCoin,
  formatKMB,
  canCraft,
  canMove,
  getMaterial,
  getNode,
  reachableFrom,
  skillLevel,
  BELONGINGS,
  HOME_TIERS,
  homeSetComplete,
  homeRestBonus,
  homeSatietyBonus,
  homeStorageBonus,
  homeHasCook,
  ownedBelongings,
  ownedBelongingIds,
  ownsBelonging,
  MARKET_ITEMS,
  QUESTS,
  RANKS,
  RECIPES,
  type ActivityId,
  type BelongingDef,
  type GameState,
  type Intent,
  type MapNode,
  type MarketItem,
  type MobId,
  type RankId,
  DIALOGUES,
  DIALOGUE_SCENES,
  NPC_NAME,
  NPC_VOICE,
  PLAYER_SPEAKER,
  RUNG_BEATS,
} from '../core';
import { el, pct } from './render';
import { FIXTURES_SENTINEL } from '../fixtures';
// ADR-139 story take-sets — imported ONLY here, so the registry rides this module's DEV fold.
import { STORY_TAKE_BUNDLES, type StoryTake, type StoryTakeBundle } from './storyTakes';
import type { RungScene } from '../core/content/rungBeats';
import type { DialogueScene } from '../core/content/intro';
import { COLD_OPEN } from '../core/content/coldOpen';
import { mountBalanceCockpit, type BalanceCockpit } from './dev-cockpit';
// Re-exported so main.ts builds the cockpit THROUGH ui/dev — keeping dev-cockpit.ts imported only
// here, riding this module's DEV fold + sentinel graph (FB-7 / ADR-059).
export { createBalanceCockpit, buildTuneArtifact } from './dev-cockpit';
export type { BalanceCockpit, TuneMeta, TouchedLever, LeverDef } from './dev-cockpit';

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
        blurb: 'Flat rows: name + grant, a bare coin buy-button (the calm, shipped default).',
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
  // FB-101 — the human reordered these two SURFACES so the Estate MAP sits at the TOP of the
  //   recency-reversed panel list: `quests` moved UP to index 3 (→ V3) and `map` moved DOWN to
  //   index 5 (→ V5, top of the list). Only the array POSITIONS changed; the entries are verbatim.
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
        blurb: 'Aligned ledger rows: kind · note · ink tally · right-aligned coin column.',
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
  // FB-102 / ADR-115 / ADR-116 — the Map splits into a SHARED you-are-here FLAVOR card (rendered in
  //   render.ts) + a terse, hint-free NAVIGATION section. This surface diverges the NAVIGATION
  //   PRESENTATION only: every variant is terse, gives NO next-zone hint (no loot/foe/reward
  //   preview), shows locked/unreachable edges GREYED, and moves by CLICKING the node (no separate
  //   "go" button). A (terse paths list) is the self-picked prod default; B…G are DEV-only.
  {
    id: 'map',
    label: 'Estate map',
    variants: [
      {
        id: 'map-a',
        label: 'A · terse paths list',
        blurb:
          'A terse hint-free list of the roads onward; click a road to walk it (the shipped default).',
      },
      {
        id: 'map-b',
        label: 'B · 絵地図 spatial schematic',
        blurb:
          'A 2D estate schematic laid out by distance from the kura; locked / undiscovered areas greyed; click a lit node.',
      },
      {
        id: 'map-c',
        label: 'C · lacquer location cards',
        blurb:
          'Each road onward a coloured lacquer card you click to walk — no destination preview, locked greyed.',
      },
      {
        id: 'map-d',
        label: 'D · 巻物 dōchūki scroll',
        blurb:
          'The estate as an unrolled scroll-ribbon; the ways onward are terse chips you click, locked greyed.',
      },
      {
        id: 'map-e',
        label: 'E · 方位 compass',
        blurb:
          'You at the hub, the roads onward set around you like a compass; click a spoke to walk.',
      },
      {
        id: 'map-f',
        label: 'F · 道 breadcrumb trail',
        blurb:
          'The trail from the kura to where you stand, then the forks onward as terse click targets.',
      },
      {
        id: 'map-g',
        label: 'G · 墨 ink node-graph',
        blurb:
          'A brushed node-graph of the estate; current node inked, reachable nodes clickable, locked greyed.',
      },
    ],
  },
  // ADR-111 / FB-89 — the home / belongings panel (the deep-housing pass shipped ONE prod default,
  //   renderBelongings; this diverge adds the mandatory live DEV alternates). Every variant shows
  //   the SAME home data (header, owned belongings + comfort badges, the live comfort tally, and the
  //   buyable acquire list wired to `buy_belonging`) — only the PRESENTATION differs.
  {
    id: 'home',
    label: 'Home / belongings',
    variants: [
      {
        id: 'home-a',
        label: 'A · functional list',
        blurb:
          'The shipped default — owned keepsakes + furniture as inked rows, a comfort tally, a coin acquire list.',
      },
      {
        id: 'home-b',
        label: 'B · 一間 room cutaway',
        blurb:
          'A diegetic woodblock room: each belonging sits in its corner, comfort read from where it rests; the acquire list is "what the room still lacks".',
      },
      {
        id: 'home-c',
        label: 'C · 持ち物帳 ledger',
        blurb:
          'A household register: what you own as ruled ledger lines, comfort as marginal notes, buyable pieces as unfilled lines.',
      },
    ],
  },
  // ── Workspace layout + framing (multi-panel, M2) — LOCKED, not toggleable. The human picked
  //    屏風 folding-columns (`layout-byobu`) + soft cards (`framing-cards`) as the sole prod
  //    rendering (ADR-075 zero-flag-debt), so the `layout`/`framing` variant surfaces were pruned:
  //    render.ts stamps the two data-attributes as CONSTANTS and CSS does all the arranging. No
  //    dead variant code ships (the classic / 番付 / 巻物 layouts + woodblock-box / hairline
  //    framings were removed here and from styles.css). ──
];

export interface DevApi {
  getVariant(surface: string): string;
  setVariant(surface: string, id: string): void;
  surfaces: readonly SurfaceDef[];
  /** ADR-139 story take-sets — the OPEN narrative-diverge bundles (empty ⇒ nothing
   *  awaiting story review). `'canon'` is always a valid take id (the live pick). */
  storyBundles: readonly StoryTakeBundle[];
  getStoryTake(bundle: string): string;
  setStoryTake(bundle: string, id: string): void;
  /** Per-unit override WITHIN the chosen set (unit keys: `rung:R1` / `intro:<sceneId>`).
   *  `undefined` clears the override (the unit follows the bundle's set again). */
  getStoryUnit(bundle: string, unit: string): string | undefined;
  setStoryUnit(bundle: string, unit: string, id: string | undefined): void;
  /** Substitute an ACTIVE canon scene with the selected take's version (identity when
   *  everything is 'canon'). Called from render.ts's `activeVn` behind the dev gate —
   *  display/content substitution only; state and RNG never fork (takes are
   *  state-compatible by the takes/README rule). */
  subRungScene(scene: RungScene): RungScene;
  subIntroScene(scene: DialogueScene): DialogueScene;
  /** Bumps on every set/unit change — render.ts folds it into the VN scene key so a
   *  take swap rebuilds the (otherwise append-only) live transcript. */
  storyEpoch(): number;
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

export function createDevApi(bundles: readonly StoryTakeBundle[] = STORY_TAKE_BUNDLES): DevApi {
  const variant: Record<string, string> = {};
  for (const s of SURFACES) variant[s.id] = s.variants[0]!.id;
  const defaultOf = (s: string): string => SURFACES.find((x) => x.id === s)?.variants[0]?.id ?? '';

  // ── ADR-139 story take-sets: bundle-level active set + per-unit overrides. 'canon' = the
  //    live pick (always valid). Injected `bundles` default to the generated registry — a
  //    test passes its own so the suite never depends on which diverges happen to be open. ──
  const storyTake: Record<string, string> = {};
  for (const b of bundles) storyTake[b.id] = 'canon';
  const unitOverride: Record<string, Record<string, string>> = {};
  let storyEpoch = 0;
  const validTake = (b: string, id: string): boolean =>
    id === 'canon' || (bundles.find((x) => x.id === b)?.takes.some((t) => t.id === id) ?? false);
  /** The effective take for a unit: its override if set, else the bundle's active set. */
  const effective = (b: string, unit: string): string =>
    unitOverride[b]?.[unit] ?? storyTake[b] ?? 'canon';

  // FB-18 — hydrate variant selections from the URL query params so a tweak survives a reload and a
  // chosen set can be shared as a link. For each surface, `?<surface.id>=<variantId>` overrides the
  // seeded default IFF the id is a real variant of that surface (guard against a stale/typo param).
  // (`MODE !== 'test'` keeps this inert under vitest, whose jsdom `location`/`history` are SHARED
  //  across a file — a prior setVariant would otherwise leak its ?param into the next fresh api.)
  if (typeof location !== 'undefined' && import.meta.env.MODE !== 'test') {
    const params = new URLSearchParams(location.search);
    for (const s of SURFACES) {
      const q = params.get(s.id);
      if (q && s.variants.some((v) => v.id === q)) variant[s.id] = q;
    }
    // story sets ride the same channel: `?story-<bundle>=<take>` (guarded like variants).
    for (const b of bundles) {
      const q = params.get(`story-${b.id}`);
      if (q && validTake(b.id, q)) storyTake[b.id] = q;
    }
  }

  return {
    getVariant: (s) => variant[s] ?? defaultOf(s),
    setVariant: (s, id) => {
      variant[s] = id;
      // FB-18 — mirror the pick back into the URL so a reload restores it (and the URL is shareable).
      // Drop the param when the pick is the surface's DEFAULT (variants[0]) so a clean state keeps
      // a clean URL; otherwise write `?<s>=<id>`.
      if (
        typeof location !== 'undefined' &&
        typeof history !== 'undefined' &&
        import.meta.env.MODE !== 'test'
      ) {
        const params = new URLSearchParams(location.search);
        if (id === defaultOf(s)) params.delete(s);
        else params.set(s, id);
        const qs = params.toString();
        history.replaceState(null, '', qs ? '?' + qs : location.pathname);
      }
    },
    surfaces: SURFACES,
    renderVariant: (s, container, state, dispatch) => {
      const id = variant[s] ?? defaultOf(s);
      if (id === defaultOf(s)) return false; // default → the caller renders it (and ships it)
      return renderSurfaceVariant(s, id, container, state, dispatch);
    },
    storyBundles: bundles,
    getStoryTake: (b) => storyTake[b] ?? 'canon',
    setStoryTake: (b, id) => {
      if (!validTake(b, id)) return;
      storyTake[b] = id;
      storyEpoch++;
      // mirror to the URL like variant picks — 'canon' (the default) keeps a clean URL.
      if (
        typeof location !== 'undefined' &&
        typeof history !== 'undefined' &&
        import.meta.env.MODE !== 'test'
      ) {
        const params = new URLSearchParams(location.search);
        if (id === 'canon') params.delete(`story-${b}`);
        else params.set(`story-${b}`, id);
        const qs = params.toString();
        history.replaceState(null, '', qs ? '?' + qs : location.pathname);
      }
    },
    getStoryUnit: (b, unit) => unitOverride[b]?.[unit],
    setStoryUnit: (b, unit, id) => {
      if (id === undefined) {
        delete unitOverride[b]?.[unit];
        storyEpoch++;
        return;
      }
      if (!validTake(b, id)) return;
      (unitOverride[b] ??= {})[unit] = id;
      storyEpoch++;
    },
    storyEpoch: () => storyEpoch,
    subRungScene: (scene) => {
      for (const b of bundles) {
        const eff = effective(b.id, `rung:${scene.rank}`);
        if (eff === 'canon') continue;
        const alt = b.takes.find((t) => t.id === eff)?.rungBeats?.[scene.rank];
        if (alt) return alt;
      }
      return scene;
    },
    subIntroScene: (scene) => {
      for (const b of bundles) {
        const eff = effective(b.id, `intro:${scene.id}`);
        if (eff === 'canon') continue;
        const alt = b.takes.find((t) => t.id === eff)?.introScenes?.find((s) => s.id === scene.id);
        if (alt) return alt;
      }
      return scene;
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
  if (surface === 'home') return renderHomeVariant(variantId, container, state, dispatch);
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

/** The diverged HOME / belongings panel (B / C) — DEV-only, stripped from prod. Default A (the
 *  functional list) ships inline in render.ts; B/C re-present the SAME home data — the header, the
 *  owned belongings (mat + bowl + bought furniture with their comfort), the live comfort-in-effect
 *  tally, and the buyable acquire list. Every buy button drives the REAL `buy_belonging` intent via
 *  the threaded `dispatch`, so a purchase moves the true state (AC-6 — same numbers as the default). */
function renderHomeVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'home-b' && variantId !== 'home-c') return false;

  const tier = HOME_TIERS[0]!;
  const owned = ownedBelongings(state);
  const ownedIds = ownedBelongingIds(state);
  const restB = homeRestBonus(state);
  const bodyB = homeSatietyBonus(state);
  const storageB = homeStorageBonus(state);
  const settled = homeSetComplete(ownedIds);
  const coin = state.resources.coin ?? 0;
  const acquirable = BELONGINGS.filter(
    (b) => b.source.kind === 'buy' && !ownsBelonging(state, b.id),
  );
  const comfortNote = (def: BelongingDef): string => {
    if (def.homesCook) return 'cook here'; // ADR-120 — the hearth homes the cook verb
    if (!def.comfort) return 'a keepsake';
    switch (def.comfort.kind) {
      case 'rest':
        return `rest +${def.comfort.amount} body`;
      case 'storage':
        return `keeps ${def.comfort.amount} belongings`; // ADR-120 — the chest is storage
      case 'body':
        return `+${def.comfort.amount} max body`;
    }
  };
  // the live comfort-in-effect tally string, shared by both variants (AC-6: the SAME selectors the
  // reducer + the prod default read — a bare corner reads 0, the settled set adds its note).
  const tallyParts: string[] = [];
  if (restB > 0) tallyParts.push(`rest +${restB} body`);
  if (bodyB > 0) tallyParts.push(`+${bodyB} max body`);
  if (storageB > 0) tallyParts.push(`storage for ${storageB} belongings`);
  if (homeHasCook(state)) tallyParts.push('a hearth to cook at');
  const tallyBase =
    tallyParts.length > 0
      ? `Comfort in effect · ${tallyParts.join(' · ')}`
      : 'A bare corner — no comforts yet.';
  const tallyText = settled ? `${tallyBase} · a settled home 整` : tallyBase;
  // a REAL buy button, wired to the reducer via dispatch — disabled when the purse is short.
  const buyButton = (def: BelongingDef, label: string): HTMLButtonElement => {
    const b = el('button', 'verb', label) as HTMLButtonElement;
    b.type = 'button';
    if (def.source.kind !== 'buy') return b;
    const afford = coin >= def.source.coinCost;
    b.disabled = !afford;
    b.title = afford
      ? `Bring it in — pay ${formatCoin(def.source.coinCost)}`
      : `Need ${formatCoin(def.source.coinCost - coin)} more`;
    b.setAttribute(
      'aria-label',
      `Bring a ${def.label.toLowerCase()} into your corner (${comfortNote(def)}) for ${formatCoin(def.source.coinCost)}`,
    );
    b.addEventListener('click', () => dispatch({ type: 'buy_belonging', belongingId: def.id }));
    return b;
  };

  if (variantId === 'home-b') {
    // ── B · 一間 room cutaway — a diegetic view of your quarters. A small woodblock room drawn as a
    //    fixed slot grid; each OWNED belonging sits IN SITU (the futon in its corner, the hearth
    //    sunk in the floor, the chest against the wall, the bowl on the mat), comfort read from where
    //    the piece rests. The acquire list below is framed as "what the room still lacks". ──
    const wrap = el('div', 'home-cutaway');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:.5rem;';

    const head = el('div');
    head.style.cssText =
      'display:flex;align-items:baseline;gap:.4rem;border-bottom:1px solid var(--ink-faint);padding-bottom:.25rem;color:var(--ink);';
    const ht = el('span', undefined, tier.label);
    ht.style.fontWeight = '700';
    const hk = el('span', undefined, tier.kanji);
    hk.lang = 'ja';
    hk.style.cssText = 'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
    head.append(ht, hk);
    wrap.append(head);
    wrap.append(el('div', 'skill-blurb', tier.blurb));

    // the room itself — a bordered "tatami" floor; belongings placed in fixed spots, present only
    // when owned. Each spot names its piece + a where-it-sits line so comfort reads spatially.
    const SPOTS: {
      id: string;
      here: string; // where it sits in the room
      col: string;
      row: string;
    }[] = [
      { id: 'straw_mat', here: 'in the corner', col: '1', row: '2' },
      { id: 'bowl', here: 'set on the mat', col: '1', row: '1' },
      { id: 'bedding', here: 'laid over the straw', col: '2', row: '2' },
      { id: 'hearth', here: 'sunk in the floor', col: '2', row: '1' },
      { id: 'chest', here: 'against the wall', col: '3', row: '1' },
    ];
    const room = el('div', 'home-room');
    room.style.cssText =
      'position:relative;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:minmax(3.4rem,auto);gap:.4rem;' +
      'border:2px solid var(--ink);background:var(--washi-shade);padding:.55rem;' +
      'background-image:repeating-linear-gradient(0deg,transparent,transparent 1.6rem,var(--washi-deep) 1.6rem,var(--washi-deep) calc(1.6rem + 1px));';
    const ownedSet = new Set(owned.map((b) => b.id));
    for (const spot of SPOTS) {
      if (!ownedSet.has(spot.id)) continue;
      const def = BELONGINGS.find((b) => b.id === spot.id)!;
      const piece = el('div', 'home-piece');
      piece.dataset.belonging = def.id;
      piece.style.cssText =
        `grid-column:${spot.col};grid-row:${spot.row};` +
        'display:flex;flex-direction:column;gap:.1rem;align-items:center;justify-content:center;text-align:center;' +
        'border:1px solid var(--ink);background:var(--washi);padding:.3rem .35rem;';
      const k = el('span', undefined, def.kanji);
      k.lang = 'ja';
      k.style.cssText = 'font-size:1.5rem;line-height:1;color:var(--ink);';
      const nm = el('span', undefined, def.label.replace(/^A /, ''));
      nm.style.cssText = 'font-size:var(--fs-micro);color:var(--ink-soft);';
      piece.append(k, nm);
      piece.append(navHomeTag(spot.here, 'var(--ink-faint)'));
      if (def.comfort) piece.append(navHomeTag(comfortNote(def), 'var(--rokusho)'));
      piece.title = def.blurb;
      room.append(piece);
    }
    wrap.append(room);

    // the live comfort-in-effect tally — the same reading the prod default shows.
    const tally = el('div', 'home-cutaway-tally', tallyText);
    tally.style.cssText = `color:${tallyParts.length > 0 ? 'var(--rokusho)' : 'var(--ink-soft)'};font-size:var(--fs-small);`;
    wrap.append(tally);

    // "what the room still lacks" — the acquire list, diegetically framed.
    if (acquirable.length > 0) {
      const lackHead = el('div', undefined, 'What the room still lacks');
      lackHead.style.cssText =
        'color:var(--ink-soft);font-family:var(--font-head);font-size:var(--fs-small);letter-spacing:.04em;margin-top:.15rem;';
      wrap.append(lackHead);
      for (const def of acquirable) {
        if (def.source.kind !== 'buy') continue;
        const line = el('div', 'home-lack-row');
        line.dataset.belonging = def.id;
        line.style.cssText =
          'display:flex;align-items:center;gap:.5rem;border-top:1px dotted var(--ink-faint);padding:.35rem 0;';
        const k = el('span', undefined, def.kanji);
        k.lang = 'ja';
        k.style.cssText = 'font-size:1.2rem;color:var(--ink-soft);flex:0 0 auto;';
        const mid = el('div');
        mid.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;gap:.08rem;';
        const nm = el('span', undefined, `${def.label} — ${comfortNote(def)}`);
        nm.style.cssText = 'color:var(--ink);';
        mid.append(nm, el('div', 'skill-blurb', def.blurb));
        line.append(k, mid, buyButton(def, formatCoin(def.source.coinCost)));
        wrap.append(line);
      }
    } else {
      wrap.append(el('div', 'skill-blurb', 'The room wants for nothing more — a settled corner.'));
    }
    container.append(wrap);
    return true;
  }

  // ── C · 持ち物帳 possessions ledger — a household register in the steward's hand. Owned pieces are
  //    ruled ledger lines (kanji · name · a marginal comfort annotation on the right); the running
  //    comfort tally is the foot line; buyable pieces trail as UNFILLED ledger lines you may ink in
  //    with a coin. Terse, calm, ink-on-washi. ──
  const ledger = el('div', 'home-ledger');
  ledger.style.cssText =
    'border:1px solid var(--ink);background:var(--washi);padding:.5rem .6rem;display:flex;flex-direction:column;gap:.3rem;';
  const cap = el('div');
  cap.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;border-bottom:2px solid var(--ink);padding-bottom:.25rem;color:var(--ink);';
  const ct = el('span', undefined, `${tier.label} — a register of what is yours`);
  ct.style.fontWeight = '700';
  const ck = el('span', undefined, '持ち物帳');
  ck.lang = 'ja';
  ck.style.cssText = 'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
  cap.append(ct, ck);
  ledger.append(cap);

  for (const def of owned) {
    const row = el('div', 'home-ledger-row');
    row.dataset.belonging = def.id;
    row.style.cssText =
      'display:flex;align-items:baseline;gap:.5rem;border-bottom:1px solid var(--ink-faint);padding:.3rem 0;';
    const k = el('span', undefined, def.kanji);
    k.lang = 'ja';
    k.style.cssText = 'flex:0 0 1.6rem;font-size:1.15rem;color:var(--ink);';
    const nm = el('span', undefined, def.label);
    nm.style.cssText =
      'flex:1;min-width:0;color:var(--ink);overflow:hidden;text-overflow:ellipsis;';
    const note = el('span', undefined, comfortNote(def));
    note.style.cssText = `flex:0 0 auto;text-align:right;font-size:var(--fs-micro);font-variant-numeric:tabular-nums;color:${def.comfort ? 'var(--rokusho)' : 'var(--ink-faint)'};`;
    row.append(k, nm, note);
    ledger.append(row);
  }

  // the running comfort total — the ledger foot line (the SAME tally the default shows).
  const foot = el('div', 'home-ledger-foot', tallyText);
  foot.style.cssText = `align-self:flex-start;padding-top:.15rem;font-variant-numeric:tabular-nums;color:${tallyParts.length > 0 ? 'var(--rokusho)' : 'var(--ink-soft)'};`;
  ledger.append(foot);

  // the UNFILLED ledger lines — pieces you may still ink into the register with a coin.
  if (acquirable.length > 0) {
    const unfilledHead = el('div', undefined, '未入 — lines yet to fill');
    unfilledHead.lang = 'ja';
    unfilledHead.style.cssText =
      'color:var(--ink-soft);font-size:var(--fs-small);border-top:2px solid var(--ink);padding-top:.3rem;margin-top:.15rem;';
    ledger.append(unfilledHead);
    for (const def of acquirable) {
      if (def.source.kind !== 'buy') continue;
      const row = el('div', 'home-unfilled-row');
      row.dataset.belonging = def.id;
      row.style.cssText =
        'display:flex;align-items:center;gap:.5rem;border-bottom:1px dotted var(--ink-faint);padding:.3rem 0;';
      const k = el('span', undefined, def.kanji);
      k.lang = 'ja';
      k.style.cssText = 'flex:0 0 1.6rem;font-size:1.1rem;color:var(--ink-soft);';
      const nm = el('span', undefined, `${def.label} · ${comfortNote(def)}`);
      nm.style.cssText = 'flex:1;min-width:0;color:var(--ink-soft);';
      const price = el('span', undefined, formatCoin(def.source.coinCost));
      price.style.cssText =
        'flex:0 0 auto;color:var(--ink-soft);font-variant-numeric:tabular-nums;white-space:nowrap;';
      row.append(k, nm, price, buyButton(def, '記す'));
      ledger.append(row);
    }
  }
  container.append(ledger);
  return true;
}

/** A muted one-line affordance tag inside the room cutaway (where a piece sits / its comfort). */
function navHomeTag(text: string, color: string): HTMLElement {
  const t = el('div', undefined, text);
  t.style.cssText = `font-size:var(--fs-micro);color:${color};`;
  return t;
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
  // ADR-107: keep the DEV variants' footer koku-consistent with the prod default's re-skin.
  card.append(
    el('div', 'influence-when', `The season re-assesses at ${formatKMB(est.highWater)} koku.`),
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
  const coin = state.resources.coin ?? 0;
  const grantStr = (item: MarketItem): string =>
    Object.entries(item.grants)
      .map(([r, n]) => `+${n} ${r}`)
      .join(', ');

  if (variantId === 'market-b') {
    // B — the posted price-board (品書 shinagaki): one notice, each good a justified ledger line —
    // name, a dotted leader, grant + price right-aligned tabular, then a 求 ("buy") verb. Stock +
    // any coin shortfall read as plain ink beneath, so an unaffordable good is HINTED, never grey.
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
      const price = el('span', undefined, formatCoin(item.coinCost));
      price.style.cssText =
        'color:var(--ink-soft);font-variant-numeric:tabular-nums;min-width:5rem;text-align:right;white-space:nowrap;';
      const verb = el('button', 'verb', capped ? '尽' : '求');
      verb.type = 'button';
      verb.disabled = !affordable;
      verb.setAttribute(
        'aria-label',
        `Buy ${item.label} (${grantStr(item)}) for ${formatCoin(item.coinCost)}${capped ? ' — sold out' : ''}`,
      );
      verb.title = capped
        ? "You've taken all the pedlar carries this run."
        : affordable
          ? `Pay ${formatCoin(item.coinCost)}`
          : `Need ${formatCoin(item.coinCost - coin)} more`;
      verb.addEventListener('click', () => buy(item.id));
      line.append(name, leader, grant, price, verb);

      const hintText = capped
        ? 'sold out'
        : affordable
          ? `${remaining} left`
          : `${remaining} left · need ${formatCoin(item.coinCost - coin)} more`;
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
    // the cloth empties, A19 — not pips). Unaffordable goods name the coin shortfall, not grey.
    const icon: Record<string, string> = {
      greens_sack: '🌿',
      wood_bundle: '🪵',
      whetstone_kit: '🪨',
      greens_basket: '🧺',
    };
    const purse = el('div', 'lock-hint', `Your purse · ${formatCoin(coin)}`);
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
          : `${remaining} of ${item.stockCap} left · need ${formatCoin(item.coinCost - coin)} more`;
      const stockLabel = el('span', 'lock-hint', stockText);
      stockLabel.style.cssText =
        'font-style:italic;font-variant-numeric:tabular-nums;align-self:flex-start;';
      mid.append(nameLine, grant, track, stockLabel);
      const right = el('div');
      right.style.cssText =
        'flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-end;gap:.25rem;';
      const price = el('span', undefined, formatCoin(item.coinCost));
      price.style.cssText =
        'color:var(--ink-soft);font-variant-numeric:tabular-nums;white-space:nowrap;';
      const take = el('button', 'verb', capped ? 'gone' : 'take 取');
      take.type = 'button';
      take.disabled = !affordable;
      take.setAttribute(
        'aria-label',
        `Buy ${item.label} (${grantStr(item)}) for ${formatCoin(item.coinCost)}${capped ? ' — sold out' : ''}`,
      );
      take.title = capped
        ? "You've taken all the pedlar carries this run."
        : affordable
          ? `Take it — pay ${formatCoin(item.coinCost)}`
          : `Need ${formatCoin(item.coinCost - coin)} more`;
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

        const rk = q.reward.resources?.coin;
        if (rk && !completed) {
          const reward = el('div', undefined, 'On fulfilment — ' + formatCoin(rk));
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
        const rk = q.reward.resources?.coin;
        if (rk) {
          const posted = el('span', undefined, 'Posted reward — ' + formatCoin(rk));
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
  //    name + terse note, an ink deeds-tally, the coin in a right-aligned tabular column (§9), and
  //    a status; a 合計 foot totals the coin in hand. ──
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

  let coinInHand = 0;
  for (const q of QUESTS) {
    const done = new Set(state.quests.progress[q.id] ?? []);
    const completed = state.quests.completed.includes(q.id);
    const accepted = state.quests.accepted.includes(q.id);
    const k = KIND[q.kind];
    const total = q.steps.length;
    const ndone = q.steps.filter((s) => done.has(s.id)).length;
    const rk = q.reward.resources?.coin ?? 0;
    if (accepted && !completed) coinInHand += rk;

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

    const coin = el('span', undefined, rk ? formatCoin(rk) : '—');
    coin.style.cssText =
      'flex:0 0 4.6rem;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:' +
      (rk ? 'var(--gold)' : 'var(--ink-faint)') +
      ';';
    row.append(coin);

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

  const foot = el('div', undefined, '合計 — coin in hand: ' + formatCoin(coinInHand));
  foot.style.cssText =
    'align-self:flex-end;color:var(--ink-soft);font-size:var(--fs-micro);font-variant-numeric:tabular-nums;padding-top:.15rem;';
  ledger.append(foot);
  container.append(ledger);
  return true;
}

// ── the diverged Estate-map NAVIGATION presentations (B…G) — DEV-only, stripped from prod. The
//    SHARED you-are-here FLAVOR card + the "who's here" list stay in render.ts; each variant here
//    re-presents ONLY the terse, HINT-FREE navigation (FB-102 / ADR-115 / ADR-116): NO next-zone preview
//    (no loot / foe / reward), locked or undiscovered edges shown GREYED, and moving = CLICKING the
//    node (no separate "go" button). The default A (the terse paths list) ships inline in render.ts.
//    Every walk target / locked edge carries a uniform `data-node` (+ `data-locked`) hook so the
//    presentation is the same to drive and to test, whatever its layout. ──
interface MapNavCtx {
  here: string;
  revealed: ReadonlySet<string>;
  condOk: boolean;
  /** The revealed adjacents you may step to (walkable OR conditioning-gated). */
  neighbours: readonly MapNode[];
  move: (id: string) => void;
  gateReason: string;
}

/** Is stepping to this neighbour blocked by the conditioning ring right now? */
function navGated(n: MapNode, ctx: MapNavCtx): boolean {
  return n.dangerRing === true && !ctx.condOk;
}
/** Make `btn` a LIVE walk target — click walks there (reuse render.ts's move_to; no core change). */
function linkMove(btn: HTMLButtonElement, id: string, ctx: MapNavCtx): void {
  btn.type = 'button';
  btn.dataset.node = id;
  btn.addEventListener('click', () => ctx.move(id));
}
/** Mark `elm` a LOCKED (greyed, un-walkable) edge — a disabled button, or an aria-disabled cell. */
function linkLocked(elm: HTMLElement, id: string, ctx: MapNavCtx): void {
  elm.dataset.node = id;
  elm.dataset.locked = '1';
  elm.setAttribute('aria-disabled', 'true');
  elm.title = ctx.gateReason;
  if (elm instanceof HTMLButtonElement) {
    elm.type = 'button';
    elm.disabled = true;
  }
}
/** A muted one-line affordance tag ("walk →" / the gate reason) — never a destination hint. */
function navTag(text: string, color: string): HTMLElement {
  const t = el('div', undefined, text);
  t.style.cssText = `font-size:var(--fs-micro);color:${color};`;
  return t;
}
function navEmpty(): HTMLElement {
  return el('div', 'skill-blurb', 'No road leads on from here.');
}
/** BFS shortest-hop distance of every revealed, reachable node from the kura (the spatial spine). */
function mapDepths(revealed: ReadonlySet<string>): Map<string, number> {
  const depth = new Map<string, number>([['kura', 0]]);
  const q: string[] = ['kura'];
  while (q.length) {
    const cur = q.shift()!;
    for (const nb of reachableFrom(cur, revealed)) {
      if (depth.has(nb.id)) continue;
      depth.set(nb.id, (depth.get(cur) ?? 0) + 1);
      q.push(nb.id);
    }
  }
  return depth;
}
/** The BFS trail of node ids from the kura to `here` (the breadcrumb spine). */
function pathToHere(here: string, revealed: ReadonlySet<string>): string[] {
  const parent = new Map<string, string | null>([['kura', null]]);
  const q: string[] = ['kura'];
  while (q.length) {
    const cur = q.shift()!;
    for (const nb of reachableFrom(cur, revealed)) {
      if (parent.has(nb.id)) continue;
      parent.set(nb.id, cur);
      q.push(nb.id);
    }
  }
  if (!parent.has(here)) return [here];
  const path: string[] = [];
  let cur: string | null = here;
  while (cur !== null) {
    path.unshift(cur);
    cur = parent.get(cur) ?? null;
  }
  return path;
}

function renderMapVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  const revealed = new Set(state.unlocked);
  const ctx: MapNavCtx = {
    here: state.location,
    revealed,
    condOk: skillLevel(state, 'conditioning') >= balance.CONDITIONING_GATE_LEVEL,
    neighbours: reachableFrom(state.location, revealed),
    move: (id) => dispatch({ type: 'move_to', to: id }),
    gateReason: `Needs Conditioning Lv${balance.CONDITIONING_GATE_LEVEL}`,
  };
  switch (variantId) {
    case 'map-b':
      renderMapSchematic(container, ctx);
      return true;
    case 'map-c':
      renderMapCards(container, ctx);
      return true;
    case 'map-d':
      renderMapScroll(container, ctx);
      return true;
    case 'map-e':
      renderMapCompass(container, ctx);
      return true;
    case 'map-f':
      renderMapTrail(container, ctx);
      return true;
    case 'map-g':
      renderMapGraph(container, ctx);
      return true;
    default:
      return false; // map-a → render.ts renders the terse paths list (ships)
  }
}

// ── B · 絵地図 — the estate as a 2D SPATIAL schematic: revealed nodes laid out in COLUMNS by their
//    distance from the kura, the current node lit, walkable neighbours live click targets, and
//    LOCKED edges GREYED — both conditioning-gated known nodes AND undiscovered ground (a "？"
//    silhouette one step past a revealed node, reveal-as-plot §5.4). Hint-free: label + kanji only. ──
function renderMapSchematic(container: HTMLElement, ctx: MapNavCtx): void {
  const { here, revealed, neighbours } = ctx;
  const isNb = (id: string): boolean => neighbours.some((n) => n.id === id);
  const depth = mapDepths(revealed);
  // undiscovered neighbours of revealed nodes → greyed silhouettes one column out.
  const fog = new Map<string, number>();
  for (const [id, d] of depth) {
    for (const nbId of getNode(id).neighbors) {
      if (!depth.has(nbId) && !canMove(id, nbId, revealed) && !fog.has(nbId)) fog.set(nbId, d + 1);
    }
  }
  const maxDepth = Math.max(0, ...depth.values(), ...fog.values());
  const board = el('div');
  board.style.cssText =
    'border:2px solid var(--ink);background:var(--washi-shade);padding:.6rem;display:flex;gap:.5rem;align-items:stretch;overflow-x:auto;';
  const cell = (hereNode: boolean, litLook: boolean, live: boolean): HTMLElement => {
    const c = el(live ? 'button' : 'div');
    c.style.cssText =
      'text-align:left;padding:.35rem .45rem;display:flex;flex-direction:column;gap:.1rem;font:inherit;' +
      'border:' +
      (hereNode ? '2px solid var(--gold)' : '1px solid var(--ink-faint)') +
      ';background:' +
      (litLook ? 'var(--washi)' : 'var(--washi-deep)') +
      ';color:' +
      (litLook ? 'var(--ink)' : 'var(--ink-soft)') +
      ';cursor:' +
      (live ? 'pointer' : 'default') +
      ';';
    return c;
  };
  for (let d = 0; d <= maxDepth; d++) {
    const colEl = el('div');
    colEl.style.cssText =
      'display:flex;flex-direction:column;gap:.5rem;justify-content:center;min-width:8.5rem;';
    for (const [id, dd] of depth) {
      if (dd !== d) continue;
      const node = getNode(id);
      const hereNode = id === here;
      const nb = isNb(id);
      const gated = nb && node.dangerRing === true && !ctx.condOk;
      const live = nb && !gated;
      const c = cell(hereNode, hereNode || nb, live);
      const line1 = el('div');
      line1.style.cssText = `display:flex;align-items:baseline;gap:.3rem;font-weight:${hereNode ? '700' : '600'};`;
      if (node.kanji) {
        const k = el('span', undefined, node.kanji);
        k.lang = 'ja';
        line1.append(k);
      }
      line1.append(el('span', undefined, node.label.replace(/^The /, '')));
      c.append(line1);
      if (hereNode) {
        c.dataset.here = '1';
        c.append(navTag('you are here', 'var(--gold)'));
      } else if (gated) {
        linkLocked(c, id, ctx);
        c.append(navTag(ctx.gateReason, 'var(--shu-deep)'));
      } else if (live) {
        linkMove(c as HTMLButtonElement, id, ctx);
        c.append(navTag('walk here →', 'var(--ink-soft)'));
      } else {
        c.dataset.node = id; // revealed but not a step away → a dim, static waypoint
      }
      colEl.append(c);
    }
    for (const [, dd] of fog) {
      if (dd !== d) continue;
      // an undiscovered edge — a greyed, anonymous "？" silhouette (reveal-as-plot: name it by
      // walking on, never spoil what waits). data-locked marks it inert; it is not a data-node target.
      const sil = el('div');
      sil.dataset.locked = '1';
      sil.setAttribute('aria-disabled', 'true');
      sil.style.cssText =
        'padding:.35rem .45rem;display:flex;flex-direction:column;gap:.1rem;opacity:.55;' +
        'border:1px dashed var(--ink-faint);background:var(--washi-deep);color:var(--ink-faint);';
      const q = el('span', undefined, '？');
      q.lang = 'ja';
      const line = el('div');
      line.style.cssText = 'display:flex;gap:.3rem;';
      line.append(q, el('span', undefined, 'unexplored'));
      sil.append(line, navTag('walk on to find it', 'var(--ink-faint)'));
      colEl.append(sil);
    }
    board.append(colEl);
  }
  container.append(board);
}

// ── C · lacquer location cards — each road onward a coloured lacquer card; the WHOLE card is the
//    click target (no separate button, no destination preview). Colour is a per-node accent, always
//    backed by the label + kanji (never colour alone, §9); locked cards greyed with their reason. ──
function renderMapCards(container: HTMLElement, ctx: MapNavCtx): void {
  const wrap = el('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:.45rem;';
  const ACCENTS = ['var(--ai)', 'var(--rokusho)', 'var(--ochre)', 'var(--gold)', 'var(--ai-soft)'];
  ctx.neighbours.forEach((n, i) => {
    const gated = navGated(n, ctx);
    const accent = n.dangerRing === true ? 'var(--beni)' : ACCENTS[i % ACCENTS.length]!;
    const card = el('button');
    card.style.cssText =
      'text-align:left;display:flex;align-items:center;gap:.55rem;padding:.5rem .6rem;font:inherit;' +
      'cursor:' +
      (gated ? 'default' : 'pointer') +
      ';border:1px solid var(--ink-faint);border-left:5px solid ' +
      accent +
      ';background:' +
      (gated ? 'var(--washi-deep)' : 'var(--washi)') +
      ';color:' +
      (gated ? 'var(--ink-soft)' : 'var(--ink)') +
      ';' +
      (gated ? 'opacity:.7;' : '');
    if (n.kanji) {
      const k = el('span', undefined, n.kanji);
      k.lang = 'ja';
      k.style.cssText = `font-size:1.35rem;line-height:1;color:${accent};`;
      card.append(k);
    }
    const body = el('div');
    body.style.cssText = 'display:flex;flex-direction:column;gap:.05rem;flex:1;min-width:0;';
    const nm = el('span', undefined, n.label.replace(/^The /, ''));
    nm.style.fontWeight = '700';
    body.append(nm);
    body.append(
      navTag(gated ? ctx.gateReason : 'walk here →', gated ? 'var(--shu-deep)' : 'var(--ink-soft)'),
    );
    card.append(body);
    if (gated) linkLocked(card, n.id, ctx);
    else linkMove(card, n.id, ctx);
    wrap.append(card);
  });
  if (ctx.neighbours.length === 0) wrap.append(navEmpty());
  container.append(wrap);
}

// ── D · 巻物 dōchūki — the estate as an unrolled SCROLL-ribbon (a horizontal band by distance from
//    the kura); the current position marked, the ways onward terse chips you click, locked greyed,
//    and a trailing "？" chip where the scroll runs into undiscovered ground. Hint-free. ──
function renderMapScroll(container: HTMLElement, ctx: MapNavCtx): void {
  const { here, revealed } = ctx;
  const depth = mapDepths(revealed);
  const ordered = [...depth.entries()].sort((a, b) => a[1] - b[1]).map(([id]) => id);
  const isNb = (id: string): boolean => ctx.neighbours.some((n) => n.id === id);
  const strip = el('div');
  strip.style.cssText =
    'display:flex;align-items:center;gap:.35rem;overflow-x:auto;padding:.5rem .3rem;' +
    'border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);background:var(--washi);';
  ordered.forEach((id, i) => {
    if (i > 0) {
      const sep = el('span', undefined, '━');
      sep.style.color = 'var(--ink-faint)';
      strip.append(sep);
    }
    const node = getNode(id);
    const hereNode = id === here;
    const nb = isNb(id);
    const gated = nb && node.dangerRing === true && !ctx.condOk;
    const live = nb && !gated;
    const chip = el(live ? 'button' : 'div');
    chip.style.cssText =
      'flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:.1rem;padding:.3rem .5rem;font:inherit;white-space:nowrap;' +
      'border:' +
      (hereNode ? '2px solid var(--gold)' : '1px solid var(--ink-faint)') +
      ';background:' +
      (hereNode || nb ? 'var(--washi-shade)' : 'var(--washi-deep)') +
      ';color:' +
      (hereNode || nb ? 'var(--ink)' : 'var(--ink-soft)') +
      ';cursor:' +
      (live ? 'pointer' : 'default') +
      ';' +
      (hereNode || nb ? '' : 'opacity:.7;');
    if (node.kanji) {
      const k = el('span', undefined, node.kanji);
      k.lang = 'ja';
      k.style.fontSize = '1.2rem';
      chip.append(k);
    }
    chip.append(el('span', undefined, node.label.replace(/^The /, '')));
    if (hereNode) {
      chip.dataset.here = '1';
      chip.append(navTag('現在地', 'var(--gold)'));
    } else if (gated) {
      linkLocked(chip, id, ctx);
      chip.append(navTag('険 locked', 'var(--shu-deep)'));
    } else if (live) {
      linkMove(chip as HTMLButtonElement, id, ctx);
      chip.append(navTag('walk →', 'var(--ink-soft)'));
    } else {
      chip.dataset.node = id;
    }
    strip.append(chip);
  });
  const hasFog = ordered.some((id) =>
    getNode(id).neighbors.some((nb) => !depth.has(nb) && !canMove(id, nb, revealed)),
  );
  if (hasFog) {
    const sep = el('span', undefined, '━');
    sep.style.color = 'var(--ink-faint)';
    const sil = el('div');
    sil.dataset.locked = '1';
    sil.setAttribute('aria-disabled', 'true');
    sil.style.cssText =
      'flex:0 0 auto;display:flex;align-items:center;gap:.2rem;padding:.3rem .5rem;white-space:nowrap;' +
      'border:1px dashed var(--ink-faint);color:var(--ink-faint);opacity:.6;';
    const q = el('span', undefined, '？');
    q.lang = 'ja';
    sil.append(q, document.createTextNode(' unexplored'));
    strip.append(sep, sil);
  }
  container.append(strip);
}

// ── E · 方位 compass — you at the hub, the roads onward set around you like a compass rose (N/E/S/W
//    then corners). Click a spoke to walk it; locked spokes greyed. Terse — direction + name only. ──
function renderMapCompass(container: HTMLElement, ctx: MapNavCtx): void {
  const grid = el('div');
  grid.style.cssText =
    'display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,minmax(3rem,auto));gap:.4rem;' +
    'border:2px solid var(--ink);background:var(--washi-shade);padding:.6rem;';
  const SLOTS = [1, 5, 7, 3, 0, 2, 6, 8]; // N, E, S, W, then the four corners — the ring around the hub
  const DIR: Record<number, string> = { 1: '北', 5: '東', 7: '南', 3: '西' };
  const place = (elm: HTMLElement, slot: number): void => {
    elm.style.gridColumn = String((slot % 3) + 1);
    elm.style.gridRow = String(Math.floor(slot / 3) + 1);
  };
  const hereNode = getNode(ctx.here);
  const hub = el('div');
  hub.dataset.here = '1';
  hub.style.cssText =
    'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.1rem;padding:.3rem;' +
    'border:2px solid var(--gold);background:var(--washi);color:var(--ink);';
  place(hub, 4);
  if (hereNode.kanji) {
    const k = el('span', undefined, hereNode.kanji);
    k.lang = 'ja';
    k.style.fontSize = '1.3rem';
    hub.append(k);
  }
  hub.append(el('span', undefined, hereNode.label.replace(/^The /, '')));
  hub.append(navTag('you are here', 'var(--gold)'));
  grid.append(hub);
  ctx.neighbours.forEach((n, i) => {
    const slot = SLOTS[i % SLOTS.length]!;
    const gated = navGated(n, ctx);
    const cell = el(gated ? 'div' : 'button');
    cell.style.cssText =
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.05rem;padding:.3rem;font:inherit;' +
      'cursor:' +
      (gated ? 'default' : 'pointer') +
      ';border:1px solid ' +
      (n.dangerRing === true ? 'var(--beni)' : 'var(--ink-faint)') +
      ';background:' +
      (gated ? 'var(--washi-deep)' : 'var(--washi)') +
      ';color:' +
      (gated ? 'var(--ink-soft)' : 'var(--ink)') +
      ';' +
      (gated ? 'opacity:.7;' : '');
    place(cell, slot);
    const dir = DIR[slot];
    if (dir) {
      const d = el('span', undefined, dir);
      d.lang = 'ja';
      d.style.cssText = 'font-size:var(--fs-micro);color:var(--ink-faint);';
      cell.append(d);
    }
    if (n.kanji) {
      const k = el('span', undefined, n.kanji);
      k.lang = 'ja';
      k.style.fontSize = '1.2rem';
      cell.append(k);
    }
    cell.append(el('span', undefined, n.label.replace(/^The /, '')));
    cell.append(
      navTag(gated ? '険 locked' : 'walk →', gated ? 'var(--shu-deep)' : 'var(--ink-soft)'),
    );
    if (gated) linkLocked(cell, n.id, ctx);
    else linkMove(cell as HTMLButtonElement, n.id, ctx);
    grid.append(cell);
  });
  container.append(grid);
}

// ── F · 道 breadcrumb trail — the trail from the kura to where you stand (read-only waypoints, the
//    current one marked), then the forks onward as terse click targets; locked forks greyed. ──
function renderMapTrail(container: HTMLElement, ctx: MapNavCtx): void {
  const wrap = el('div');
  wrap.style.cssText =
    'border:1px solid var(--ink);background:var(--washi);padding:.5rem .6rem;display:flex;flex-direction:column;gap:.5rem;';
  const trail = el('div');
  trail.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:.3rem;';
  const path = pathToHere(ctx.here, ctx.revealed);
  path.forEach((id, i) => {
    if (i > 0) {
      const s = el('span', undefined, '›');
      s.style.color = 'var(--ink-faint)';
      trail.append(s);
    }
    const node = getNode(id);
    const hereNode = id === ctx.here;
    const crumb = el(
      'span',
      undefined,
      (node.kanji ? node.kanji + ' ' : '') + node.label.replace(/^The /, ''),
    );
    crumb.style.cssText = `font-weight:${hereNode ? '700' : '400'};color:${hereNode ? 'var(--ink)' : 'var(--ink-soft)'};`;
    if (hereNode) crumb.dataset.here = '1';
    trail.append(crumb);
  });
  wrap.append(trail);
  const forks = el('div');
  forks.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;';
  const lead = el('span', undefined, 'onward');
  lead.style.cssText = 'color:var(--ink-faint);font-size:var(--fs-micro);';
  forks.append(lead);
  ctx.neighbours.forEach((n) => {
    const gated = navGated(n, ctx);
    const b = el(gated ? 'div' : 'button');
    b.style.cssText =
      'display:inline-flex;align-items:center;gap:.3rem;padding:.25rem .5rem;font:inherit;' +
      'cursor:' +
      (gated ? 'default' : 'pointer') +
      ';border:1px solid ' +
      (n.dangerRing === true ? 'var(--beni)' : 'var(--ink-faint)') +
      ';background:' +
      (gated ? 'var(--washi-deep)' : 'var(--washi-shade)') +
      ';color:' +
      (gated ? 'var(--ink-soft)' : 'var(--ink)') +
      ';' +
      (gated ? 'opacity:.7;' : '');
    b.append(document.createTextNode('› ' + n.label.replace(/^The /, '') + ' '));
    if (n.kanji) {
      const k = el('span', undefined, n.kanji);
      k.lang = 'ja';
      b.append(k);
    }
    if (gated) {
      b.append(navTag(ctx.gateReason, 'var(--shu-deep)'));
      linkLocked(b, n.id, ctx);
    } else {
      linkMove(b as HTMLButtonElement, n.id, ctx);
    }
    forks.append(b);
  });
  if (ctx.neighbours.length === 0) forks.append(navEmpty());
  wrap.append(forks);
  container.append(wrap);
}

// ── G · 墨 ink node-graph — a brushed SVG graph of the revealed estate: sumi edges between adjacent
//    nodes, the current node inked on a 朱 seal, reachable nodes clickable ink circles, locked
//    (conditioning-gated) nodes greyed. Hint-free — a node is its kanji + name, nothing more. ──
function renderMapGraph(container: HTMLElement, ctx: MapNavCtx): void {
  const { here, revealed } = ctx;
  const depth = mapDepths(revealed);
  const isNb = (id: string): boolean => ctx.neighbours.some((n) => n.id === id);
  const byDepth = new Map<number, string[]>();
  for (const [id, d] of depth) {
    const arr = byDepth.get(d) ?? [];
    arr.push(id);
    byDepth.set(d, arr);
  }
  const maxDepth = Math.max(0, ...depth.values());
  const rows = Math.max(1, ...[...byDepth.values()].map((a) => a.length));
  const colW = 150;
  const rowH = 82;
  const padX = 52;
  const padY = 46;
  const width = padX * 2 + maxDepth * colW;
  const height = padY * 2 + (rows - 1) * rowH;
  const pos = new Map<string, { x: number; y: number }>();
  for (const [d, ids] of byDepth) {
    ids.forEach((id, i) => {
      pos.set(id, { x: padX + d * colW, y: height / 2 + (i - (ids.length - 1) / 2) * rowH });
    });
  }
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('role', 'group');
  svg.style.cssText =
    'max-width:100%;height:auto;border:2px solid var(--ink);background:var(--washi-shade);';
  // sumi edges (drawn once per revealed adjacency).
  const drawn = new Set<string>();
  for (const [id, p] of pos) {
    for (const nb of getNode(id).neighbors) {
      const q = pos.get(nb);
      if (!q) continue;
      const key = [id, nb].sort().join('|');
      if (drawn.has(key)) continue;
      drawn.add(key);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', String(p.x));
      line.setAttribute('y1', String(p.y));
      line.setAttribute('x2', String(q.x));
      line.setAttribute('y2', String(q.y));
      line.setAttribute('stroke', 'var(--ink-faint)');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-linecap', 'round');
      svg.append(line);
    }
  }
  // nodes.
  for (const [id, p] of pos) {
    const node = getNode(id);
    const hereNode = id === here;
    const nb = isNb(id);
    const gated = nb && node.dangerRing === true && !ctx.condOk;
    const live = nb && !gated;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('data-node', id);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', String(p.x));
    c.setAttribute('cy', String(p.y));
    c.setAttribute('r', '21');
    c.setAttribute('fill', hereNode ? 'var(--shu)' : nb ? 'var(--washi)' : 'var(--washi-deep)');
    c.setAttribute(
      'stroke',
      hereNode ? 'var(--shu-deep)' : gated ? 'var(--ink-faint)' : 'var(--ink)',
    );
    c.setAttribute('stroke-width', hereNode ? '3' : '2');
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', String(p.x));
    t.setAttribute('y', String(p.y + 6));
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-size', '16');
    t.setAttribute('lang', 'ja');
    t.setAttribute('fill', hereNode ? 'var(--washi)' : 'var(--ink)');
    t.textContent = node.kanji ?? node.label.slice(0, 1);
    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', String(p.x));
    lbl.setAttribute('y', String(p.y + 38));
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('font-size', '11');
    lbl.setAttribute('fill', 'var(--ink-soft)');
    lbl.textContent = node.label.replace(/^The /, '');
    g.append(c, t, lbl);
    if (hereNode) {
      g.setAttribute('data-here', '1');
    } else if (gated) {
      g.setAttribute('data-locked', '1');
      g.setAttribute('aria-disabled', 'true');
      g.style.opacity = '0.55';
      const ttl = document.createElementNS(NS, 'title');
      ttl.textContent = ctx.gateReason;
      g.append(ttl);
    } else if (live) {
      g.style.cursor = 'pointer';
      g.setAttribute('role', 'button');
      g.addEventListener('click', () => ctx.move(id));
    } else {
      g.style.opacity = '0.7';
    }
    svg.append(g);
  }
  container.append(svg);
}

// ── the DEV panel — a floating, collapsible control surface (DEV-only) ──

/** The subset of `window.__qa` the panel drives. main.ts's qa object satisfies this
 *  structurally; the panel never sees the rest of __qa. */
export interface DevQa {
  /** Live state, for the FB-7 balance cockpit's §5 live-feedback readouts (rung/capstone ETA, etc.). */
  state(): GameState;
  speed(mult: number): number;
  jumpToPhase2(): unknown;
  jumpToAscension(): void;
  faceWolf(): void;
  toRung(id: RankId): unknown;
  auto(id: ActivityId | null): void;
  autoCombat(id: MobId | null): void;
  newGame(seed?: number): void;
  /** FB-96 save-backup safety net: `hasBackup` gates the "goto last backup" button; `restoreBackup`
   *  rewinds to the pre-New-game snapshot. Both async (they hit the redundant storage backends). */
  hasBackup(): Promise<boolean>;
  restoreBackup(): Promise<boolean>;
  /** FB-6 scenario saves: load a NAMED fixture (backup-first) + list the available scenarios. */
  loadFixture(name: string): Promise<unknown>;
  fixtures(): ReadonlyArray<{ name: string; blurb: string }>;
  /** Read the live rung so the panel can highlight it (structural subset of __qa.selectors). */
  selectors: { rung(): RankId };
  /** FB-8 — the attended-time telemetry handle (absent only in tests that stub qa). The panel's
   *  Telemetry section is MINIMAL by human lock: one-liner + drop/clear (no copy/download). */
  telemetry?:
    | undefined
    | {
        sentinel: string;
        summary(): {
          runId: string;
          class: string;
          attendedMin: number;
          activeMin: number;
          idleMin: number;
          segments: number;
          taints: readonly string[];
        };
        drop(): void;
        clear(): void;
      };
}

export function mountDevPanel(
  host: HTMLElement,
  opts: { qa: DevQa; dev: DevApi; rerender: () => void; cockpit: BalanceCockpit },
): void {
  const { qa, dev, rerender, cockpit } = opts;

  const panel = el('div');
  panel.setAttribute('data-dev', DEV_SENTINEL);
  // bottom-anchored floating overlay; collapsed it shrinks to the header (width:fit-content),
  // expanded it grows to 15rem (see the head click handler). Never reserves layout space (FB-2/FB-4).
  // FB-37 — the panel is a FLEX COLUMN (fixed head / scrolling body / fixed footer) and itself
  // clips (overflow:hidden); the SCROLL lives on the tab panes below, NOT the whole panel, so the
  // New-game footer stays pinned no matter how far the variants scroll.
  panel.style.cssText =
    // FB-119 — widened 16rem → 24rem so the FB-6 Scenarios tab (long fixture names) isn't clipped.
    'position:fixed;bottom:.5rem;right:.5rem;z-index:9999;width:fit-content;max-width:24rem;max-height:82vh;' +
    'display:flex;flex-direction:column;overflow:hidden;' +
    'background:#1c1814;color:#e7d9bc;font:12px/1.45 ui-monospace,SFMono-Regular,monospace;' +
    'border:1px solid #b08d4f;border-radius:4px;box-shadow:0 2px 14px rgba(0,0,0,.45);';

  // header (click to collapse the body) — fixed (never scrolls)
  const head = el('div');
  head.style.cssText =
    'flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;padding:.35rem .5rem;' +
    'background:#26221e;border-bottom:1px solid #7a6c59;cursor:pointer;user-select:none;font-weight:700;';
  head.append(el('span', undefined, '⚙ DEV'));
  const caret = el('span', undefined, '▾');
  head.append(caret);
  panel.append(head);

  const body = el('div');
  // start COLLAPSED so the panel is as small as possible by default (FB-4). FB-37 — the body is the
  // flex-growing middle of the panel column (min-height:0 lets its scrolling pane child shrink);
  // it clips so ONLY the panes scroll, keeping the tab bar and footer pinned.
  body.style.cssText =
    'padding:.4rem .5rem;display:none;flex-direction:column;gap:.5rem;flex:1 1 auto;min-height:0;overflow:hidden;';
  panel.append(body);
  caret.textContent = '▸';
  head.addEventListener('click', () => {
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'flex' : 'none';
    caret.textContent = hidden ? '▾' : '▸';
    panel.style.width = hidden ? '15rem' : 'fit-content';
  });

  // ── sub-tab bar: two panes (Settings / Variants) under one sub-header. Default = Variants
  //    (the ADR-075 review focus). Each tab shows its pane and hides the other. ──
  const tabBar = el('div');
  // FB-37 — the tab bar is fixed above the scroll region (never scrolls with the panes). FB-7 — it now
  // WRAPS (four tabs no longer fit the 15rem expanded width on one row), so the Balance tab is always
  // reachable (two rows of two) instead of clipping off the right edge.
  tabBar.style.cssText =
    'flex:0 0 auto;display:flex;flex-wrap:wrap;gap:.25rem;margin-bottom:.15rem;';
  // FB-37 — the panes are the ONLY scrolling area: each grows to fill the body's middle and scrolls
  // its own overflow, so the fixed footer below stays pinned no matter how tall the content is.
  const paneScroll = 'flex:1 1 auto;min-height:0;overflow:auto;';
  const settingsPane = el('div');
  settingsPane.style.cssText = `display:none;flex-direction:column;gap:.5rem;${paneScroll}`;
  const variantsPane = el('div');
  variantsPane.style.cssText = `display:flex;flex-direction:column;gap:.4rem;${paneScroll}`;
  // FB-6 — a third pane: named scenario-save fixtures (DEV tooling; not a player surface, so the
  // ADR-075 diverge mandate doesn't apply — capture-inbox precedent). Populated after enableRestore.
  const scenariosPane = el('div');
  scenariosPane.style.cssText = `display:none;flex-direction:column;gap:.2rem;${paneScroll}`;
  // FB-7 — a fourth pane: the balance-tuning cockpit (DEV instrument panel, ADR-059; not a player
  // surface, so the ADR-075 diverge mandate doesn't apply — same precedent as Scenarios/capture-inbox).
  const balancePane = el('div');
  balancePane.style.cssText = `display:none;flex-direction:column;gap:.15rem;${paneScroll}`;
  // ADR-139 — a fifth pane: the STORY take-set switcher (sibling of the UI-variant toggle, per the
  // human's lock: "variants & story variants as different elements in the DEV menu"). DEV review
  // instrument for open narrative diverges; single-idea + taste brief per the locked lighter
  // ADR-075 split (the Scenarios/Balance precedent) — the script-reader modal is the full-diverge
  // surface, not this switcher.
  const storyPane = el('div');
  storyPane.style.cssText = `display:none;flex-direction:column;gap:.4rem;${paneScroll}`;

  const tabBtn = (label: string): HTMLButtonElement => {
    const b = el('button', undefined, label);
    b.type = 'button';
    // flex-basis 40% ⇒ two tabs per row inside the wrapping bar; nowrap keeps each label on one line.
    b.style.cssText =
      'flex:1 1 40%;white-space:nowrap;border:1px solid #7a6c59;border-radius:3px;padding:.2rem .4rem;' +
      'font:inherit;cursor:pointer;font-weight:700;';
    return b;
  };
  type TabId = 'settings' | 'variants' | 'scenarios' | 'balance' | 'story';
  const settingsTab = tabBtn('Settings');
  const variantsTab = tabBtn('Variants');
  const scenariosTab = tabBtn('Scenarios');
  const balanceTab = tabBtn('Balance');
  const storyTab = tabBtn('Story');
  const tabs: Record<TabId, { tab: HTMLButtonElement; pane: HTMLElement }> = {
    settings: { tab: settingsTab, pane: settingsPane },
    variants: { tab: variantsTab, pane: variantsPane },
    scenarios: { tab: scenariosTab, pane: scenariosPane },
    balance: { tab: balanceTab, pane: balancePane },
    story: { tab: storyTab, pane: storyPane },
  };
  const selectTab = (which: TabId): void => {
    for (const id of Object.keys(tabs) as TabId[]) {
      const { tab, pane } = tabs[id];
      const on = id === which;
      pane.style.display = on ? 'flex' : 'none';
      tab.style.background = on ? '#b08d4f' : '#3a322a';
      tab.style.color = on ? '#1c1814' : '#e7d9bc';
    }
  };
  for (const id of Object.keys(tabs) as TabId[]) {
    tabs[id].tab.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTab(id);
    });
  }
  tabBar.append(settingsTab, variantsTab, scenariosTab, balanceTab, storyTab);
  body.append(tabBar, settingsPane, variantsPane, scenariosPane, balancePane, storyPane);

  // FB-7 — mount the balance cockpit into its pane; the touched count badges the tab label
  // (`Balance (3)`) so a dirty tuning session is obvious no matter which sub-tab is showing.
  mountBalanceCockpit(balancePane, cockpit, {
    getState: qa.state,
    onDirty: (count) => {
      balanceTab.textContent = count > 0 ? `Balance (${count})` : 'Balance';
    },
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
    settingsPane.append(sec);
    return rows;
  };

  // speed — FB-49: 1·2·4·8·16, with the ACTIVE multiplier highlighted (reuse the gold #b08d4f /
  // dark #1c1814 active idiom the tab bar + variant toggles use). Track the selected button so a
  // click marks it active and clears the rest; default the highlight to 1× (the game's start speed).
  const speed = section('Speed');
  const speedBtns = new Map<number, HTMLButtonElement>();
  const markSpeed = (active: number): void => {
    for (const [m, b] of speedBtns) {
      const on = m === active;
      b.style.background = on ? '#b08d4f' : '#3a322a';
      b.style.color = on ? '#1c1814' : '#e7d9bc';
      b.style.fontWeight = on ? '700' : 'normal';
    }
  };
  for (const m of [1, 2, 4, 8, 16]) {
    const b = mono(`${m}×`, () => {
      qa.speed(m);
      markSpeed(m);
    });
    speedBtns.set(m, b);
    speed.append(b);
  }
  markSpeed(1); // the game starts at 1×

  // teleports
  const jump = section('Jump');
  jump.append(mono('→ Phase 2', () => qa.jumpToPhase2()));
  jump.append(mono('→ Ascend-ready', () => qa.jumpToAscension()));
  // FB-68 — a button for EVERY rung in the roster (source of truth: RANKS/ranks.ts), not a partial
  // set. Clicking teleports in EITHER direction (toRung resets-then-climbs to descend); the CURRENT
  // rung reads highlighted (the gold #b08d4f active idiom the Speed row + tab bar use). Compact:
  // id + kanji on the button face, the full English title in the tooltip.
  const rungs = section('Rung');
  const rungBtns = new Map<RankId, HTMLButtonElement>();
  const markRung = (active: RankId): void => {
    for (const [id, b] of rungBtns) {
      const on = id === active;
      b.style.background = on ? '#b08d4f' : '#3a322a';
      b.style.color = on ? '#1c1814' : '#e7d9bc';
      b.style.fontWeight = on ? '700' : 'normal';
    }
  };
  for (const r of RANKS) {
    const b = mono(`${r.id} ${r.kanji}`, () => {
      qa.toRung(r.id);
      markRung(qa.selectors.rung());
    });
    b.title = r.title;
    rungBtns.set(r.id, b);
    rungs.append(b);
  }
  markRung(qa.selectors.rung()); // highlight the rung the game is currently at

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

  // FB-8 — Telemetry (MINIMAL by human lock 2026-07-05: one live line + drop/clear; the
  // copy/download/console.table buttons were cut — the project/telemetry/ folder drop is the
  // transport). DEV instrument panel, not a player surface → diverge-exempt (locked; the
  // Scenarios/Balance precedent). The line refreshes on a slow tick; stamped with the FB-8
  // sentinel so the strip gate can see the section rode the DEV fold.
  if (qa.telemetry) {
    const tele = section('Telemetry');
    const t = qa.telemetry;
    const line = el('div');
    line.style.cssText = 'flex:1 1 100%;color:#e7d9bc;opacity:.85;';
    line.dataset.sentinel = t.sentinel;
    const refresh = (): void => {
      const s = t.summary();
      const taint = s.taints.length > 0 ? ` · TAINTED (${s.taints.join(', ')})` : '';
      line.textContent = `${s.attendedMin} min attended (${s.activeMin} active / ${s.idleMin} idle) · now: ${s.class} · ${s.segments} seg${taint}`;
    };
    refresh();
    window.setInterval(refresh, 5000);
    tele.append(line);
    tele.append(mono('Drop report → project/telemetry/', () => t.drop()));
    tele.append(
      mono('Clear history', () => {
        if (window.confirm('Clear ALL telemetry history (every stored run)?')) t.clear();
      }),
    );
  }

  // FB-38 — New game lives ONLY in the fixed footer now (it used to be duplicated here in a
  // Settings→Game section). The footer copy (below, FB-34) is the single always-visible one.

  // ── ADR-139 — the STORY pane: one block per OPEN narrative-diverge bundle. Coarse
  //    set-switch (Canon / take …) keeps a whole coherent take live so pacing reads true;
  //    per-unit override rows below mix within the set. Swaps are display-only (takes are
  //    state-compatible) and re-render immediately; live swap covers the VN scene types
  //    (rung beats + intro scenes) — dialogue/cold-open units read in the script-reader. ──
  storyTab.textContent =
    dev.storyBundles.length > 0 ? `Story (${dev.storyBundles.length})` : 'Story';
  if (dev.storyBundles.length === 0) {
    const empty = el('div', undefined, 'No open story diverges — nothing awaiting review.');
    empty.style.cssText = 'color:#9b8e78;padding:.3rem .1rem;';
    storyPane.append(empty);
  } else {
    // the full-page reader entry (the human's "explore story variant" modal — its OWN surface,
    // full ADR-075 diverge: three reading variants behind the pills in the modal header).
    const openBtn = mono('⤢ Explore story — full-page reader', () => {
      openStoryReader(dev.storyBundles);
    });
    openBtn.style.alignSelf = 'flex-start';
    storyPane.append(openBtn);
  }
  const LIVE_UNITS = /^(rung|intro):/;
  const unitKeysOf = (b: StoryTakeBundle): string[] => {
    const keys = new Set<string>();
    for (const t of b.takes) {
      for (const k of Object.keys(t.rungBeats ?? {})) keys.add(`rung:${k}`);
      for (const s of t.introScenes ?? []) keys.add(`intro:${s.id}`);
      for (const d of t.dialogues ?? []) keys.add(`dialogue:${d.id}`);
      for (const k of Object.keys(t.coldOpen ?? {})) keys.add(`cold-open:${k}`);
    }
    return [...keys].sort();
  };
  for (const bundle of dev.storyBundles) {
    const sec = el('div');
    sec.style.cssText = 'border:1px solid #3a322a;border-radius:3px;padding:.28rem .4rem;';
    const title = el('div', undefined, bundle.title);
    title.style.cssText = 'color:#b08d4f;text-transform:uppercase;font-size:11px;';
    sec.append(title);

    // the active take's brief (or the pick rationale on Canon) — refreshed on every click.
    const brief = el('div', undefined, '');
    brief.style.cssText = 'color:#9b8e78;font-size:11px;margin:.15rem 0;';

    const takeOf = (id: string): StoryTake | undefined => bundle.takes.find((t) => t.id === id);
    const setRow = el('div');
    setRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;margin-top:.2rem;';
    const setBtns = new Map<string, HTMLButtonElement>();
    const refresh = (): void => {
      const active = dev.getStoryTake(bundle.id);
      for (const [id, b] of setBtns) {
        const on = id === active;
        b.style.background = on ? '#b08d4f' : '#3a322a';
        b.style.color = on ? '#1c1814' : '#e7d9bc';
        b.style.fontWeight = on ? '700' : 'normal';
      }
      brief.textContent =
        active === 'canon'
          ? (bundle.rationale ?? 'Canon — the live pick.')
          : (takeOf(active)?.brief ?? '');
    };
    const takeBtn = (id: string, label: string): void => {
      const b = mono(label, () => {
        dev.setStoryTake(bundle.id, id);
        refresh();
        rerender();
      });
      setBtns.set(id, b);
      setRow.append(b);
    };
    takeBtn('canon', 'Canon');
    for (const t of bundle.takes) takeBtn(t.id, `${t.id.toUpperCase()} — ${t.label}`);
    sec.append(setRow, brief);

    // per-unit override rows — "·" follows the set; a take letter pins THIS unit to that take.
    // (a single-unit bundle skips the block: the set switch IS the unit switch.)
    const units = unitKeysOf(bundle);
    if (units.length > 1) {
      const uHead = el('div', undefined, 'Per-unit override (· = follow set)');
      uHead.style.cssText =
        'color:#b08d4f;font-size:10px;text-transform:uppercase;margin-top:.25rem;';
      sec.append(uHead);
      for (const unit of units) {
        const row = el('div');
        row.style.cssText = 'display:flex;align-items:center;gap:.25rem;flex-wrap:wrap;';
        const lbl = el('span', undefined, LIVE_UNITS.test(unit) ? unit : `${unit} (reader-only)`);
        lbl.style.cssText = 'color:#e7d9bc;font-size:11px;flex:1 1 auto;';
        row.append(lbl);
        const uBtns = new Map<string | undefined, HTMLButtonElement>();
        const uRefresh = (): void => {
          const cur = dev.getStoryUnit(bundle.id, unit);
          for (const [id, b] of uBtns) {
            const on = id === cur;
            b.style.background = on ? '#b08d4f' : '#3a322a';
            b.style.color = on ? '#1c1814' : '#e7d9bc';
          }
        };
        const uBtn = (id: string | undefined, label: string): void => {
          const b = mono(label, () => {
            dev.setStoryUnit(bundle.id, unit, id);
            uRefresh();
            rerender();
          });
          b.style.padding = '.05rem .3rem';
          uBtns.set(id, b);
          row.append(b);
        };
        uBtn(undefined, '·');
        uBtn('canon', 'canon');
        for (const t of bundle.takes) uBtn(t.id, t.id.toUpperCase());
        uRefresh();
        sec.append(row);
      }
    }
    const hint = el(
      'div',
      undefined,
      'Swaps are display-only. To see a rung beat live: Settings → Rung → jump to it.',
    );
    hint.style.cssText = 'color:#9b8e78;font-size:10px;margin-top:.25rem;opacity:.8;';
    sec.append(hint);
    refresh();
    storyPane.append(sec);
  }

  // ── the live variant toggle — the heart of ADR-075 review. Each surface is a COLLAPSED summary
  //    row (label + current pick + caret); clicking it reveals the blurb + the option buttons.
  //    Rows are RECENCY-ordered: SURFACES is oldest→newest (new surfaces are appended), so we
  //    display it REVERSED — the most-recently-introduced surface sits at the top. ──
  // V-numbering (FB-36) — per-SURFACE, assigned in REGISTRY order: each surface gets ONE number
  // (surface[0]=V0, surface[1]=V1, …), and its variants share that number with a LETTER suffix =
  // the variant's index (A/B/C). So quests (registry #6) → V6A/V6B/V6C. Registry order (not the
  // recency-reversed DISPLAY order) keeps a tag pinned to its variant: it never shifts when the
  // panel reorders rows or a later surface is removed. Computed once, read into every label below.
  const vtag = new Map<string, string>();
  const LETTERS = 'ABCDEFGHIJ';
  dev.surfaces.forEach((s, si) => {
    s.variants.forEach((v, vi) => {
      vtag.set(v.id, `V${si}${LETTERS[vi] ?? String(vi)}`);
    });
  });

  const recencyOrdered = dev.surfaces.slice().reverse();
  for (const surface of recencyOrdered) {
    const sec = el('div');
    sec.style.cssText = 'border:1px solid #3a322a;border-radius:3px;';

    // the clickable collapsed summary row — a two-line VERTICAL stack (playtest FB-35): line 1 is
    // the caret + surface NAME only; line 2 sits underneath (indented under the name, muted) as
    // `V{n}{letter} · {label}` — V-tag first. Stacking (vs cramming name+label+[Vn] on one line) stops
    // the long rows (e.g. HOUSE-INFLUENCE GRADE) wrapping badly / overflowing the panel's edge.
    const summary = el('div');
    summary.style.cssText =
      'display:flex;flex-direction:column;gap:.05rem;padding:.28rem .4rem;cursor:pointer;user-select:none;min-width:0;';
    // line 1 — caret + name
    const sTitle = el('div');
    sTitle.style.cssText = 'display:flex;align-items:baseline;gap:.35rem;min-width:0;';
    const sCaret = el('span', undefined, '▸');
    sCaret.style.cssText = 'color:#b08d4f;flex:0 0 auto;';
    const sLabel = el('span', undefined, surface.label);
    sLabel.style.cssText = 'color:#b08d4f;text-transform:uppercase;font-size:11px;min-width:0;';
    sTitle.append(sCaret, sLabel);
    // line 2 — current pick, indented under the name, wraps within the panel width
    const sPick = el('span', undefined, '');
    sPick.style.cssText =
      'color:#9b8e78;font-size:11px;padding-left:1.05rem;overflow-wrap:anywhere;min-width:0;';
    summary.append(sTitle, sPick);
    sec.append(summary);

    // the collapsible details area (blurb + option buttons), hidden by default
    const details = el('div');
    details.style.cssText = 'display:none;flex-direction:column;gap:.25rem;padding:0 .4rem .35rem;';
    const blurb = el('div', undefined, '');
    blurb.style.cssText = 'color:#9b8e78;font-size:11px;min-height:1.4em;';
    const rows = el('div');
    rows.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;';
    const buttons: HTMLButtonElement[] = [];

    const paint = (): void => {
      const cur = dev.getVariant(surface.id);
      surface.variants.forEach((v, i) => {
        const on = v.id === cur;
        buttons[i]!.style.background = on ? '#b08d4f' : '#3a322a';
        buttons[i]!.style.color = on ? '#1c1814' : '#e7d9bc';
        if (on) {
          blurb.textContent = v.blurb;
          sPick.textContent = `${vtag.get(v.id)} · ${v.label}`;
        }
      });
    };
    surface.variants.forEach((v) => {
      const b = mono(`${vtag.get(v.id)} · ${v.label}`, () => {
        dev.setVariant(surface.id, v.id);
        paint();
        rerender();
      });
      // FB-35 — left-align the option label (mono defaults to centered), so a long pick like
      // `V6A · A · price-button list` reads cleanly instead of centre-wrapping.
      b.style.textAlign = 'left';
      buttons.push(b);
      rows.append(b);
    });
    details.append(blurb, rows);
    sec.append(details);

    summary.addEventListener('click', () => {
      const hidden = details.style.display === 'none';
      details.style.display = hidden ? 'flex' : 'none';
      sCaret.textContent = hidden ? '▾' : '▸';
    });

    variantsPane.append(sec);
    paint();
  }

  // default active sub-tab = Variants (the review focus)
  selectTab('variants');

  // FB-34/FB-37 — a PERMANENT New-game footer, TRULY fixed at the bottom of the panel column
  // (flex:0 0 auto, outside the scrolling panes) so it's reachable no matter which sub-tab is
  // active OR how far the variants scroll. FB-38 — this is now the SOLE New-game control (the old
  // duplicate in the Settings→Game section was removed).
  // FB-96 — the footer stacks two half-width rows: "goto last backup" ABOVE "New game". A flex COLUMN
  // so the buttons stack; each button is width:50% + align-self:flex-start (left-anchored).
  const footer = el('div');
  footer.style.cssText =
    'flex:0 0 auto;margin-top:.15rem;padding-top:.4rem;border-top:1px solid #7a6c59;' +
    'display:flex;flex-direction:column;gap:.25rem;';

  // FB-96 — "goto last backup": restores the snapshot New game takes before it wipes the run. Starts
  // DISABLED (dimmed) and is enabled once a backup exists — either found on mount (a prior session)
  // or created the moment New game is pressed.
  const restoreBtn = mono('↩ last backup', () => {
    if (!restoreBtn.disabled) void qa.restoreBackup();
  });
  restoreBtn.style.width = '50%';
  restoreBtn.style.alignSelf = 'flex-start';
  restoreBtn.disabled = true;
  restoreBtn.style.opacity = '.45';
  restoreBtn.style.cursor = 'not-allowed';
  const enableRestore = (): void => {
    restoreBtn.disabled = false;
    restoreBtn.style.opacity = '1';
    restoreBtn.style.cursor = 'pointer';
  };
  footer.append(restoreBtn);

  // FB-6 — populate the Scenarios pane: one row per fixture (name · blurb · Load). loadFixture is
  // backup-first (it snapshots the current run to the FB-96 slot), so a load can never destroy the
  // human's real save — lighting "↩ last backup" is the way home. The sentinel stamps the pane so
  // the strip gate (gh-pages.sh) can grep-prove these DEV bytes never ship (Ph3, R2).
  scenariosPane.dataset.sentinel = FIXTURES_SENTINEL;
  for (const { name, blurb } of qa.fixtures()) {
    const row = el('div');
    row.style.cssText =
      'display:flex;flex-direction:column;gap:.1rem;padding:.3rem 0;border-bottom:1px solid #3a322a;';
    const top = el('div');
    top.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:.5rem;';
    const nm = el('div', undefined, name);
    nm.style.cssText = 'font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;';
    const loadBtn = mono('Load', () => {
      void Promise.resolve(qa.loadFixture(name)).then(() => enableRestore());
    });
    top.append(nm, loadBtn);
    const bl = el('div', undefined, blurb);
    bl.style.cssText = 'font-size:11px;color:#a89878;line-height:1.35;';
    row.append(top, bl);
    scenariosPane.append(row);
  }

  // FB-95 — New game is HALF WIDTH + left-anchored (was flex:1 / full width) so an accidental
  // double-click on the compact dev menu can't land on it and wipe the run; the right half is empty.
  // FB-96 — pressing it also enables the restore button (a fresh backup now exists).
  const newGameFooterBtn = mono('⟳ New game', () => {
    qa.newGame();
    enableRestore();
  });
  newGameFooterBtn.style.width = '50%';
  newGameFooterBtn.style.alignSelf = 'flex-start';
  newGameFooterBtn.style.fontWeight = '700';
  footer.append(newGameFooterBtn);
  body.append(footer);

  // enable "goto last backup" if a backup already exists from a prior session (async storage probe).
  void Promise.resolve(qa.hasBackup())
    .then((has) => {
      if (has) enableRestore();
    })
    .catch(() => undefined);

  host.append(panel);
  // NOTE: the panel is position:fixed and floats OVER the app (bottom-right), so it reserves
  // NO layout space — the game UI centers on the full viewport (playtest FB-2/FB-4). The old
  // `#app paddingRight:16rem` gutter (which de-centered the UI and exposed a white strip) is gone.
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// ADR-139 · the "Explore story" full-page script-reader — a DEV modal for READING an open
// narrative-diverge bundle in-game (the human's ask: review the readable script in the game,
// not t0-story.md in an editor). READ-ONLY: sign-off stays conversational; no canon writes.
//
// FULL ADR-075 diverge (the locked split): three genuinely-distinct reading experiences,
// switchable live via the R/G/S pills in the modal header — each its own R-item:
//   annotated — the play-order script, canon inline, alternates nested under each unit;
//   galley    — units as rows, takes as columns (side-by-side compare at a glance);
//   stage     — ONE take read end-to-end (closest to how a player will hear it), local
//               take pills; units the take lacks fall back to canon, marked.
// Taste brief (Pass 1) — brainstorms/2026-07-06-narrative-diverge-design.md build appendix:
// clones .modal-scrim/.modal-card/.modal-close, speaker colour via `log-line voice-*`,
// instant paint (NOT story scope — no typewriter), script breathes / chrome dense (P19).
// ═══════════════════════════════════════════════════════════════════════════════════════════

interface ReaderLine {
  readonly voice: string;
  readonly speaker?: string | undefined;
  readonly text: string;
  readonly kind: 'line' | 'prompt' | 'option';
}

type ReaderScene = RungScene | DialogueScene;

/** Flatten a VN scene (rung beat / intro scene) into instant-paint script lines. */
function readerSceneLines(scene: ReaderScene): ReaderLine[] {
  const out: ReaderLine[] = [];
  const speakerName = scene.speaker ? NPC_NAME[scene.speaker] : undefined;
  for (const g of scene.greeting) {
    out.push({ voice: g.voice, speaker: g.speaker, text: g.text, kind: 'line' });
  }
  for (const t of scene.topics) {
    out.push({ voice: 'player', speaker: PLAYER_SPEAKER, text: t.label, kind: 'line' });
    for (const a of t.answer) {
      out.push({ voice: a.voice, speaker: a.speaker, text: a.text, kind: 'line' });
    }
  }
  out.push({ voice: 'narrator', text: scene.decision.prompt, kind: 'prompt' });
  for (const o of scene.decision.options) {
    out.push({ voice: 'player', speaker: PLAYER_SPEAKER, text: o.say, kind: 'option' });
    const rn = 'reactNpc' in o && o.reactNpc ? o.reactNpc : undefined;
    out.push({
      voice: rn ? NPC_VOICE[rn] : scene.voice,
      speaker: rn ? NPC_NAME[rn] : speakerName,
      text: o.react,
      kind: 'line',
    });
  }
  return out;
}

/** Every unit key a bundle's takes touch, in reading order (cold-open → intro → rungs → dialogue). */
function readerUnitsOf(bundle: StoryTakeBundle): string[] {
  const keys = new Set<string>();
  for (const t of bundle.takes) {
    for (const k of Object.keys(t.coldOpen ?? {})) keys.add(`cold-open:${k}`);
    for (const s of t.introScenes ?? []) keys.add(`intro:${s.id}`);
    for (const k of Object.keys(t.rungBeats ?? {})) keys.add(`rung:${k}`);
    for (const d of t.dialogues ?? []) keys.add(`dialogue:${d.id}`);
  }
  const order = (k: string): number =>
    k.startsWith('cold-open:') ? 0 : k.startsWith('intro:') ? 1 : k.startsWith('rung:') ? 2 : 3;
  return [...keys].sort((a, b) => order(a) - order(b) || a.localeCompare(b));
}

/** The content of `unit` in `take` ('canon' reads the LIVE registries). Null ⇒ absent. */
function readerUnitLines(unit: string, take: StoryTake | 'canon'): ReaderLine[] | null {
  const [kind, key] = [unit.slice(0, unit.indexOf(':')), unit.slice(unit.indexOf(':') + 1)];
  if (kind === 'rung') {
    const s = take === 'canon' ? RUNG_BEATS[key as RankId] : take.rungBeats?.[key as RankId];
    return s ? readerSceneLines(s) : null;
  }
  if (kind === 'intro') {
    const s =
      take === 'canon'
        ? DIALOGUE_SCENES.find((x) => x.id === key)
        : take.introScenes?.find((x) => x.id === key);
    return s ? readerSceneLines(s) : null;
  }
  if (kind === 'dialogue') {
    const d =
      take === 'canon'
        ? DIALOGUES.find((x) => x.id === key)
        : take.dialogues?.find((x) => x.id === key);
    return d
      ? d.lines.map((l) => ({
          voice: l.voice ?? 'villager',
          speaker: d.speaker,
          text: l.text,
          kind: 'line' as const,
        }))
      : null;
  }
  const text = take === 'canon' ? (COLD_OPEN as Record<string, string>)[key] : take.coldOpen?.[key];
  return text ? [{ voice: 'narrator', text, kind: 'line' }] : null;
}

/** Append `lines` as an instant-paint script block (the reading register — it breathes).
 *  A line whose text is byte-identical to canon (`canonTexts`) DIMS and labels itself —
 *  deliberate sharing must never read as a failed substitution (FB-124, TST4). */
function readerScriptBlock(
  host: HTMLElement,
  lines: readonly ReaderLine[],
  canonTexts?: ReadonlySet<string>,
): void {
  const block = el('div');
  block.style.cssText = 'display:flex;flex-direction:column;gap:.5rem;max-width:62ch;';
  for (const l of lines) {
    const line = el('div');
    line.className = `log-line voice-${l.voice}`;
    line.style.cssText = 'font-size:1rem;line-height:1.65;';
    if (l.kind === 'prompt')
      line.style.cssText += 'font-weight:700;color:var(--ink);margin-top:.35rem;';
    if (l.kind === 'option') line.style.cssText += 'margin-top:.4rem;';
    line.textContent =
      (l.kind === 'option' ? '▸ ' : '') + (l.speaker ? `${l.speaker}: ${l.text}` : l.text);
    if (canonTexts?.has(l.text)) {
      line.style.opacity = '.45';
      line.title = 'identical to canon (shared line)';
    }
    block.append(line);
  }
  host.append(block);
}

/** A tight chrome chip (the dense register — labels, takes, briefs). */
function readerChip(text: string, tone: 'pick' | 'alt' | 'mute' = 'mute'): HTMLElement {
  const c = el('span', undefined, text);
  const bg = tone === 'pick' ? 'var(--rokusho)' : tone === 'alt' ? 'var(--ai)' : 'var(--ink-faint)';
  c.style.cssText =
    `display:inline-block;background:${bg};color:var(--washi);border-radius:3px;` +
    'padding:.05rem .45rem;font-size:11px;letter-spacing:.08em;text-transform:uppercase;';
  return c;
}

function readerUnitHeader(host: HTMLElement, unit: string, extra?: HTMLElement): void {
  const h = el('div');
  h.style.cssText =
    'display:flex;align-items:center;gap:.5rem;margin:1.4rem 0 .6rem;padding-top:.9rem;' +
    'border-top:1px solid var(--ink-faint);';
  h.append(readerChip(unit, 'mute'));
  if (extra) h.append(extra);
  host.append(h);
}

/** Variant "galley" — units as rows, takes as columns (side-by-side compare). */
function renderReaderGalley(host: HTMLElement, bundle: StoryTakeBundle): void {
  for (const unit of readerUnitsOf(bundle)) {
    readerUnitHeader(host, unit);
    const scroll = el('div');
    scroll.style.cssText = 'overflow-x:auto;';
    const row = el('div');
    const cols = 1 + bundle.takes.length;
    row.style.cssText = `display:grid;grid-template-columns:repeat(${cols},minmax(17rem,1fr));gap:1rem;`;
    const cell = (
      head: HTMLElement,
      lines: ReaderLine[] | null,
      canonTexts?: ReadonlySet<string>,
    ): void => {
      const c = el('div');
      c.style.cssText = 'border:1px solid var(--ink-faint);padding:.7rem .8rem;min-width:0;';
      const hd = el('div');
      hd.style.cssText = 'margin-bottom:.5rem;display:flex;gap:.5rem;flex-wrap:wrap;';
      hd.append(head);
      c.append(hd);
      if (lines) readerScriptBlock(c, lines, canonTexts);
      else {
        const none = el('div', undefined, '— no take for this unit (canon plays) —');
        none.style.cssText = 'color:var(--ink-faint);font-size:12px;';
        c.append(none);
      }
      row.append(c);
    };
    const canonLines = readerUnitLines(unit, 'canon');
    const canonTexts = new Set((canonLines ?? []).map((l) => l.text));
    cell(readerChip('canon · the pick', 'pick'), canonLines);
    for (const t of bundle.takes) {
      cell(readerChip(`${t.id} · ${t.label}`, 'alt'), readerUnitLines(unit, t), canonTexts);
    }
    scroll.append(row);
    host.append(scroll);
  }
}

/** Open the full-page reader. Returns the scrim (exposed for tests).
 *  Galley-only since FB-125: the human picked Galley columns FIRM (HR-9 ✅);
 *  the annotated/stage variants were retired (recoverable from git history +
 *  the HR-9 archive record). */
export function openStoryReader(bundles: readonly StoryTakeBundle[]): HTMLElement {
  const scrim = el('div');
  scrim.className = 'modal-scrim';
  scrim.dataset['dev'] = DEV_SENTINEL;
  const card = el('div');
  card.className = 'modal-card frame';
  // FB-122/FB-123 — a true full-page reading surface. The CARD never scrolls (the .frame
  // key-lines stay intact — scrolling the frame itself left its absolute ::after border
  // stranded mid-content); title + pills pin, and the content pane below scrolls internally
  // (the "chrome pinned, panes scroll" idiom).
  card.style.cssText =
    'max-width:none;width:100%;height:calc(100dvh - 2rem);overflow:hidden;' +
    'display:flex;flex-direction:column;';
  scrim.append(card);

  const close = el('button', undefined, '×');
  close.className = 'modal-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the story reader');
  card.append(close);

  const title = el('div');
  title.className = 'modal-title';
  const kami = el('span', undefined, '物語');
  kami.className = 'kami';
  const roman = el('span', undefined, 'Explore story — open diverges');
  roman.className = 'roman';
  title.append(kami, roman);
  card.append(title);

  // galley-only since FB-125 (HR-9 ✅ — the human picked Galley columns firm).
  // the ONE scrolling region (FB-123) — the frame + title above never move.
  const content = el('div');
  content.style.cssText =
    'flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.5rem;margin-top:1rem;';
  if (bundles.length === 0) {
    const empty = el('div', undefined, 'No open story diverges — nothing awaiting review.');
    empty.style.cssText = 'color:var(--ink-faint);margin-top:1rem;';
    content.append(empty);
  }
  for (const bundle of bundles) {
    const bh = el('div');
    bh.style.cssText = 'margin-top:1.1rem;display:flex;flex-direction:column;gap:.25rem;';
    const bt = el('div', undefined, bundle.title);
    bt.style.cssText = 'font-weight:700;color:var(--ink);letter-spacing:.04em;';
    bh.append(bt);
    if (bundle.review) {
      const rv = el('div', undefined, `review doc: ${bundle.review}`);
      rv.style.cssText = 'color:var(--ink-faint);font-size:12px;';
      bh.append(rv);
    }
    content.append(bh);
    renderReaderGalley(content, bundle);
  }
  card.append(content);

  const dismiss = (): void => {
    document.removeEventListener('keydown', onKey);
    scrim.remove();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') dismiss();
  };
  close.addEventListener('click', dismiss);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) dismiss();
  });
  document.addEventListener('keydown', onKey);

  document.body.append(scrim);
  return scrim;
}

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
  getMaterial,
  BELONGINGS,
  HOME_TIERS,
  homeSetComplete,
  cornerRestBonus,
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
  type BelongingDef,
  type GameState,
  type Intent,
  type MarketItem,
  type RankId,
  DIALOGUES,
  DIALOGUE_SCENES,
  NPC_NAME,
  NPC_VOICE,
  PLAYER_SPEAKER,
  RUNG_BEATS,
  sceneById,
  isUnlocked,
} from '../core';
import { el, pct, HOUSE_ROOMS, ESTATE_STAGE_NAMES } from './render';
import { FIXTURES_SENTINEL } from '../fixtures';
// ADR-139 story take-sets — imported ONLY here, so the registry rides this module's DEV fold.
import { STORY_TAKE_BUNDLES, type StoryTake, type StoryTakeBundle } from './storyTakes';
import {
  __setRequirementFlavorOverride,
  __setDiscoveryFlavorOverride,
  __setJudgeFlavorOverride,
  __setRakeCapLineOverride,
  __setRestOpenLineOverride,
  __setWorksFlavorOverride,
  __setIntroTitleOverride,
  RUNG_REQUIREMENTS,
  getRank,
  estateBuild,
  stageLabel,
  stageBlurb,
  WORKS_PROJECTS,
  stageDiscovery,
  getNode,
  nodeSeasonalBlurb,
  season,
  ESTATE_STAGES,
  availableLabours,
  availableActions,
  activityForecast,
  restRefill,
  restQuality,
  canAffordAct,
  rakeExhausted,
  OUT_OF_STRENGTH_REASON,
  isWaged,
  DAY_WAGE_MON,
  canWorkProject,
  hasFlag,
  AREAS,
  type ActivityId,
} from '../core';
import type { RungScene } from '../core/content/rungBeats';
import type { DialogueScene } from '../core/content/intro';
import { COLD_OPEN, RAKE_DONE_REASON } from '../core/content/coldOpen';
import { actionKey } from '../app/action-clock';
import { FLAVOR } from '../core/content/flavor';
import { mountBalanceCockpit, type BalanceCockpit } from './dev-cockpit';
import { mountRequirementsCheatlist } from './dev-cheatlist';
import { openT1Map, openT2Map } from './map-sheets/sheet';
import { openStampBook } from './stamp-book/book';
import { openEstateSheet } from './estate-sheet/demo';
import { openSceneCards } from './scene-cards/cards';
import { openSceneCardsV1 } from './scene-cards/cards-v1';
import { loadActionHover, saveActionHover } from './ui-prefs';
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
  /** The rung a player first meets this surface — the Variants tab groups by it so the panel
   *  tracks a rung-by-rung QA (2026-07-09; matches review.md's rung grouping). Display-only;
   *  V-tags stay registry-ordered. Omit ⇒ sorts last ("other"). */
  rung?: number;
  /** variants[0] is the prod DEFAULT (self-picked); the rest are DEV-only alternates. */
  variants: VariantDef[];
}

/** The registry of diverged surfaces + their variants — the single source the panel toggle
 *  and the renderer both read. Grows as Step 2 adds craft / market / quests. */
export const SURFACES: SurfaceDef[] = [
  {
    id: 'zone',
    rung: 0,
    label: 'Zone do-panel',
    variants: [
      {
        id: 'zone-a',
        label: 'A · zone placard',
        blurb:
          'The inline default: a where-you-stand placard over the classic verb groups (ships).',
      },
      {
        id: 'zone-b',
        label: 'B · worktable ledger',
        blurb: 'One dense ruled board — every verb a uniform row with its numbers inline.',
      },
      {
        id: 'zone-c',
        label: 'C · ink-scene banner',
        blurb: 'The place as hero — a kanji banner, then one calm full-width verb stack.',
      },
      {
        id: 'zone-d',
        label: 'D · banner + standing line',
        blurb:
          "C's banner with the zone's standing line (the seasonal node read) between the hero and the verbs.",
      },
    ],
  },
  {
    id: 'influence',
    rung: 3,
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
    rung: 4,
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
    // ADR-177 Phase 2 (ADR-075) — the Works 普請 projects home. A (the day-book page)
    // ships inline in render.ts; B/C live here, DEV-only.
    id: 'works',
    rung: 2,
    label: 'Works 普請 (projects home)',
    variants: [
      {
        id: 'works-a',
        label: 'A · the day-book page',
        blurb:
          'shipped default — projects as ledger lines: closed entries ruled through, the open entry priced, the future unruled',
      },
      {
        id: 'works-b',
        label: 'B · the work-site board',
        blurb:
          'one site card per project — the zones you walk, each carrying its concern state and the commissioning',
      },
      {
        id: 'works-c',
        label: 'C · the build ladder (interim)',
        blurb: 'the pre-ADR-177 tracker shape — ladder rows + improve card, kept for comparison',
      },
    ],
  },
  {
    // ADR-177 Phase 2 (ADR-075, F5) — Estate 家: the house itself. A (the drawn sheet,
    // the E1 fold-in) ships inline; B/C live here, DEV-only.
    id: 'estate-house',
    rung: 6,
    label: 'Estate 家 (the house)',
    variants: [
      {
        id: 'estate-house-a',
        label: 'A · the house, drawn',
        blurb:
          'shipped default — the okoshi-ezu survey sheet as the tab anchor; rooms ink in as they reopen',
      },
      {
        id: 'estate-house-b',
        label: "B · the steward's reckoning",
        blurb: 'the rooms as day-book lines — open/shut per room, the standing as the footing',
      },
      {
        id: 'estate-house-c',
        label: 'C · the rooms list (interim)',
        blurb: 'the pre-ADR-177 shape — the plain reopened-rooms card',
      },
    ],
  },
  {
    id: 'market',
    rung: 1,
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
  // FB-262 — the Story log's VN GROUPS: HR-24 signed off on A · 幕 card (2026-07-10), so it
  // ships as THE prod rendering (render.ts stamps .scene-line/.scene-open/.scene-close; the
  // 幕-card look is unconditional in styles.css). The B/C alternates were stripped (zero
  // flag-debt); git history keeps the margin-rail + raised-plate takes.
  {
    id: 'quests',
    rung: 5,
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
    rung: 3,
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
  // FB-102 / ADR-115 / ADR-116 / HR-7 — the Estate map surface is RESOLVED: the human picked
  //   H · 絵図 survey plan from the real-map diverge (2026-07-07, "V7D"), so the sheet now ships
  //   as THE prod map (render.ts imports map-variants/sheet-map.ts directly) and the losing takes
  //   (B/G schematics + I/J/K/L real-map takes) were stripped — ADR-075 zero flag-debt. NOTE:
  //   removing this group renumbered the DEV panel's V-tags for LATER surfaces (home V8→V7).
  // ADR-111 / FB-89 — the home / belongings panel (the deep-housing pass shipped ONE prod default,
  //   renderBelongings; this diverge adds the mandatory live DEV alternates). Every variant shows
  //   the SAME home data (header, owned belongings + comfort badges, the live comfort tally, and the
  //   buyable acquire list wired to `buy_belonging`) — only the PRESENTATION differs.
  {
    id: 'home',
    rung: 3,
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
  // ── FB-340 v2 (HR-31 confirmed 2026-07-11) — the porter piece IS the presence; the
  //    A/B rings toggle was deleted on the human's confirm (ADR-075 zero flag-debt). ──
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
  /** Substitute an ACTIVE generalized scene-def (season-exit / scripted VN beat) with the
   *  selected take's version, keyed by scene id (identity when everything is 'canon'). Called
   *  from render.ts's `activeVn` behind the dev gate — display/content only; state + RNG never
   *  fork (takes are state-compatible). Its trigger already fired in canon, so the swap only
   *  changes what the live scene READS. */
  subScene(scene: RungScene): RungScene;
  /** Substitute a canon UI flavor line (`FLAVOR[key]`) with the active take's version
   *  (ADR-139 — identity when everything is 'canon'). Called from render.ts behind the dev
   *  gate so a flavor-line diverge swaps LIVE in the running game, not just in the reader. */
  subFlavor(key: string, canon: string): string;
  /** Substitute a cold-open keyed-prose line (`COLD_OPEN[key]`) with the active take's
   *  version (HD-37 unit A — identity when everything is 'canon'). Live for the RENDER-READ
   *  keys (the title card's `lede`/`cta`); core-emitted keys stay reader-only (T2 — logged
   *  history never rewrites), and the intro-reused ones ride their scene's own swap. */
  subColdOpen(key: string, canon: string): string;
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

  // FB-121 — push the effective requirement-flavor overlay into the CORE (the
  // declaring-module DEV setter, like the balance cockpit's levers): completion lines
  // are core-emitted log text, so the switcher swaps FUTURE emissions there, not at
  // render time. Recomputed on every set/unit change; null (all-canon) clears it.
  const syncReqFlavor = (): void => {
    const overlay: Record<string, string> = {};
    for (const b of bundles) {
      for (const t of b.takes) {
        if (!t.reqFlavor) continue;
        for (const [key, text] of Object.entries(t.reqFlavor)) {
          if (effective(b.id, `req-flavor:${key}`) === t.id) overlay[key] = text;
        }
      }
    }
    __setRequirementFlavorOverride(Object.keys(overlay).length > 0 ? overlay : null);
    // ADR-146 — the discovery-moment line is core-emitted too: forward the effective FLAVOR
    // take entries so FUTURE latches voice the selected take (already-logged lines stay, T2).
    // Keyed by flavor key; only defs whose lineKey matches are affected (discoveries.ts).
    const discOverlay: Record<string, string> = {};
    for (const b of bundles) {
      for (const t of b.takes) {
        if (!t.flavor) continue;
        for (const [key, text] of Object.entries(t.flavor)) {
          if (effective(b.id, `flavor:${key}`) === t.id) discOverlay[key] = text;
        }
      }
    }
    __setDiscoveryFlavorOverride(Object.keys(discOverlay).length > 0 ? discOverlay : null);
    // C5a unit 4 — the seasonal-judge line is core-emitted (step.ts onReckoning): forward
    // the same effective flavor-take entries so FUTURE reckonings voice the selected take
    // (judgeLine* keys; other keys are ignored by the reader — flavor.ts JUDGE_KEY).
    __setJudgeFlavorOverride(Object.keys(discOverlay).length > 0 ? discOverlay : null);
    // FB-324 (ADR-139) — the rake-cap line is core-emitted too (intents.ts rake_rice):
    // forward the effective `rakeCapLine` flavor take so a FUTURE cap emit voices it.
    __setRakeCapLineOverride(discOverlay['rakeCapLine'] ?? null);
    // FB-402 (ADR-139) — the open-rest line is core-emitted too (intents.ts rest):
    // forward the effective `restOpen` flavor take so a FUTURE rest emit voices it.
    __setRestOpenLineOverride(discOverlay['restOpen'] ?? null);
    // ADR-177 (works-cause bundle) — the works discovery lines (day-book naming,
    // zone sightings, the ladder hints + U1's stage strings) are core-emitted/-read:
    // forward the same effective flavor-take entries (works.ts worksLine resolver).
    __setWorksFlavorOverride(Object.keys(discOverlay).length > 0 ? discOverlay : null);
    // FB-362 (ADR-139) — the intro scene titles are core-emitted contexts (intents.ts
    // stamps introSceneTitle on every intro log line): forward the effective
    // `## prose intro-title` take entries (keyed by scene id) so a FUTURE intro run's
    // 幕-heads voice the selected take; logged history keeps its baked heads (TST2).
    const titleOverlay: Record<string, string> = {};
    for (const b of bundles) {
      for (const t of b.takes) {
        if (!t.introTitles) continue;
        for (const [key, text] of Object.entries(t.introTitles)) {
          if (effective(b.id, `intro-title:${key}`) === t.id) titleOverlay[key] = text;
        }
      }
    }
    __setIntroTitleOverride(Object.keys(titleOverlay).length > 0 ? titleOverlay : null);
  };

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

  syncReqFlavor(); // honour a ?story-<bundle>= URL selection from the first emission

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
      syncReqFlavor();
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
        syncReqFlavor();
        return;
      }
      if (!validTake(b, id)) return;
      (unitOverride[b] ??= {})[unit] = id;
      storyEpoch++;
      syncReqFlavor();
    },
    storyEpoch: () => storyEpoch,
    subRungScene: (scene) => {
      if (scene.rank === undefined) return scene; // non-promotion scene — no rung-beat take alt
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
    subScene: (scene) => {
      for (const b of bundles) {
        const eff = effective(b.id, `scene:${scene.id}`);
        if (eff === 'canon') continue;
        const alt = b.takes.find((t) => t.id === eff)?.scenes?.[scene.id];
        if (alt) return alt;
      }
      return scene;
    },
    subFlavor: (key, canon) => {
      for (const b of bundles) {
        const eff = effective(b.id, `flavor:${key}`);
        if (eff === 'canon') continue;
        const alt = b.takes.find((t) => t.id === eff)?.flavor?.[key];
        if (alt !== undefined) return alt;
      }
      return canon;
    },
    subColdOpen: (key, canon) => {
      for (const b of bundles) {
        const eff = effective(b.id, `cold-open:${key}`);
        if (eff === 'canon') continue;
        const alt = b.takes.find((t) => t.id === eff)?.coldOpen?.[key];
        if (alt !== undefined) return alt;
      }
      return canon;
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
  if (surface === 'zone') return renderZoneVariant(variantId, container, state, dispatch);
  if (surface === 'influence') return renderInfluenceGrade(variantId, container, state);
  if (surface === 'craft') return renderCraftVariant(variantId, container, state);
  if (surface === 'market') return renderMarketVariant(variantId, container, state, dispatch);
  if (surface === 'quests') return renderQuestsVariant(variantId, container, state, dispatch);
  if (surface === 'bestiary') return renderBestiaryVariant(variantId, container, state);
  if (surface === 'home') return renderHomeVariant(variantId, container, state, dispatch);
  if (surface === 'works') return renderWorksVariant(variantId, container, state, dispatch);
  if (surface === 'estate-house') return renderEstateHouseVariant(variantId, container, state);
  return false;
}

/** FB-410 (ADR-075) — the diverged ZONE do-panel (B · worktable ledger / C · ink-scene
 *  banner / D · the banner carrying the zone's standing line). DEV-only; the default A
 *  (zone placard over the classic groups) ships inline in render.ts. Every alternate
 *  re-presents the SAME core reads (availableActions / availableLabours / the place-strip
 *  predicates) and drives the REAL intents — every variant works (ADR-075). Buttons are
 *  stamped with the clock's actionKey so the global paintActionClock sweep gives them the
 *  lock + progress bar for free. Rebuilds are signature-guarded: the pane only re-renders
 *  when a value it shows changed (an idle tick repaints nothing — TST2 holds even under the
 *  DEV toggle). */
function renderZoneVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'zone-b' && variantId !== 'zone-c' && variantId !== 'zone-d') return false;
  const here = getNode(state.location);
  // D · the standing line — the SAME seasonal node read the Map's you-are-here card resolves
  // (map.ts nodeSeasonalBlurb, one source — TST1), so it breathes by season for free.
  const standingLine = variantId === 'zone-d' ? nodeSeasonalBlurb(here, season(state)).text : '';
  const labours = availableLabours(state);
  const metas = availableActions(state).filter((a) => a !== 'open_eyes');
  const roundLive = state.roundState !== null;
  const nightPending =
    hasFlag(state, 'rank-r3') && !hasFlag(state, 'wolf-survived-not-won') && !roundLive;
  const atGate = state.location === 'gate';
  const waged = isWaged(state.rung);
  const owed = state.wageDaysAccrued;
  const canWork = canWorkProject(state);
  const workDef = canWork
    ? ESTATE_STAGES.find((d) => d.stage === state.estateCommission)
    : undefined;
  const exhausted = rakeExhausted(state);
  const affordable = canAffordAct(state);
  const sig = [
    variantId,
    state.location,
    standingLine, // the seasonal read changes with the season — repaint when it does
    state.rung,
    metas.join(','),
    labours.map((o) => `${o.activity.id}:${o.available ? 1 : 0}`).join(','),
    Math.round(restRefill(state)),
    String(state.autoRake),
    String(state.autoActivity),
    roundLive ? `live:${state.roundState!.stage}` : nightPending && atGate ? 'night' : '',
    waged ? `wage:${owed}` : '',
    canWork ? `works:${state.estateWorkDone}` : '',
    exhausted ? 'rx' : affordable ? '' : 'poor',
  ].join('|');
  if (container.dataset.zoneSig === sig) return true;
  container.dataset.zoneSig = sig;
  container.textContent = '';

  const verb = (
    label: string,
    title: string,
    onClick: () => void,
    opts: { primary?: boolean; disabled?: boolean; act?: Parameters<typeof actionKey> } = {},
  ): HTMLButtonElement => {
    const b = el('button', opts.primary ? 'verb primary' : 'verb', label) as HTMLButtonElement;
    b.type = 'button';
    b.title = title;
    if (opts.disabled) b.disabled = true;
    if (opts.act) b.dataset.actKey = actionKey(...opts.act);
    b.addEventListener('click', onClick);
    return b;
  };
  const autoToggle = (activityId: ActivityId | null): HTMLButtonElement => {
    // activityId === null ⇒ the rake's auto (set_auto_rake); else the labour auto (set_auto).
    const on = activityId === null ? state.autoRake : state.autoActivity === activityId;
    const b = el('button', `auto-toggle${on ? ' on' : ''}`, on ? '■ stop' : '▶ auto');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(on));
    b.addEventListener('click', () =>
      dispatch(
        activityId === null
          ? { type: 'set_auto_rake', on: !on }
          : { type: 'set_auto', activityId: on ? null : activityId },
      ),
    );
    return b;
  };
  const labourTitle = (o: (typeof labours)[number]): string => {
    const f = activityForecast(state, o.activity);
    const gains = Object.entries(f.gained)
      .map(([res, n]) => `+${n} ${res === 'rice' ? 'shō (kura)' : res}`)
      .join(' · ');
    return `${gains ? `${gains} · ` : ''}+${f.xp} ${o.activity.skill} xp · −${o.activity.satietyCost} body`;
  };
  const restTitle = (): string => {
    const hungry = restQuality(state) < 0.99;
    return `+${restRefill(state)} body — a free breather${hungry ? ' (poor on an empty belly)' : ''}.`;
  };

  // ── the shared row model: [button, auto?, areaLabel, numbers] per affordance ──
  interface Row {
    btn: HTMLButtonElement;
    auto?: HTMLButtonElement | undefined;
    area: string;
    nums: string;
  }
  const rows: Row[] = [];
  for (const a of metas) {
    if (a === 'rake_rice') {
      rows.push({
        btn: verb(
          'Rake the spilled rice',
          exhausted
            ? RAKE_DONE_REASON
            : affordable
              ? `+${balance.RICE_PER_RAKE} shō (kura) · −${balance.SATIETY_PER_ACT} body`
              : OUT_OF_STRENGTH_REASON,
          () => dispatch({ type: 'rake_rice' }),
          { disabled: exhausted || !affordable, act: ['rake_rice', undefined] },
        ),
        auto: exhausted ? undefined : autoToggle(null),
        area: here.label,
        nums: `+${balance.RICE_PER_RAKE} shō`,
      });
    } else if (a === 'rest') {
      rows.push({
        btn: verb('Rest a moment', restTitle(), () => dispatch({ type: 'rest' }), {
          act: ['rest', undefined],
        }),
        area: '—',
        nums: `+${restRefill(state)} body`,
      });
    }
  }
  if (nightPending && atGate) {
    rows.push({
      btn: verb(
        '🏮 Post the night watch 夜廻',
        'Stand the grain-watch through the night stages — it can end in a fight.',
        () =>
          dispatch({
            type: 'begin_night_round',
            roundId: hasFlag(state, 'wolf-survived-not-won') ? 'grain-watch' : 'first-night-round',
          }),
        { primary: true },
      ),
      area: here.label,
      nums: 'night',
    });
  }
  if (waged) {
    rows.push({
      btn: verb(
        owed > 0
          ? `Collect your wage 給 (${owed * DAY_WAGE_MON} mon)`
          : 'Wage board 給 — nothing owed',
        'The day-book accrues your wage 給 by the worked day — collect what stands owed.',
        () => dispatch({ type: 'collect_wage' }),
        { disabled: owed <= 0 },
      ),
      area: '—',
      nums: owed > 0 ? `${owed * DAY_WAGE_MON} mon` : '0',
    });
  }
  if (canWork && workDef) {
    rows.push({
      btn: verb(
        `Work the repairs 普請 (${state.estateWorkDone} / ${workDef.workActs})`,
        `One act of the commissioned work — ${stageLabel(workDef)}.`,
        () => dispatch({ type: 'work_project' }),
        {
          primary: true,
          disabled: state.character.satiety < balance.WORKS_ACT_SATIETY,
          act: ['work_project', undefined],
        },
      ),
      area: here.label,
      nums: `${state.estateWorkDone}/${workDef.workActs}`,
    });
  }
  for (const o of labours) {
    rows.push({
      btn: verb(
        o.activity.label,
        labourTitle(o),
        () => dispatch({ type: 'do_activity', activityId: o.activity.id }),
        { disabled: !o.available, act: ['do_activity', { activityId: o.activity.id }] },
      ),
      auto: autoToggle(o.activity.id),
      area: areaLabelOf(o.activity.area),
      nums: (() => {
        const f = activityForecast(state, o.activity);
        const first = Object.entries(f.gained)[0];
        return first ? `+${first[1]} ${first[0] === 'rice' ? 'shō' : first[0]}` : `+${f.xp} xp`;
      })(),
    });
  }

  if (variantId === 'zone-b') {
    // ── B · worktable ledger: one dense ruled board, uniform rows, numbers inline ──
    const board = el('div', 'zone-ledger');
    const head = el('div', 'zl-head');
    const seal = el('span', 'zone-seal', here.kanji ?? '場');
    seal.lang = 'ja';
    head.append(seal, el('span', undefined, here.label), el('span', 'zl-area', 'what you can do'));
    board.append(head);
    if (rows.length === 0) {
      const empty = el('div', 'zl-row');
      empty.append(
        el(
          'span',
          'area-blurb',
          'No work to be had where you stand — open the Map 地図 tab to walk on.',
        ),
      );
      board.append(empty);
    }
    for (const r of rows) {
      const rowEl = el('div', 'zl-row');
      const cell = el('div', 'zb-rowline');
      cell.append(r.btn);
      if (r.auto) cell.append(r.auto);
      rowEl.append(cell, el('span', 'zl-area', r.area), el('span', 'zl-num', r.nums));
      board.append(rowEl);
    }
    container.append(board);
    return true;
  }

  // ── C · ink-scene banner: the place as hero, then one calm full-width stack ──
  // ── D · the same banner, with the zone's standing line read between the two ──
  const pane = el('div', 'zone-banner');
  const head = el('div', 'zb-head');
  const kanji = el('span', 'zb-kanji', here.kanji ?? '場');
  kanji.lang = 'ja';
  const nameCol = el('div');
  nameCol.append(el('div', 'zb-name', here.label));
  nameCol.append(el('p', 'zb-kicker', 'what you can do here'));
  head.append(kanji, nameCol);
  pane.append(head);
  if (standingLine !== '') pane.append(el('p', 'zb-blurb', standingLine));
  if (rows.length === 0) {
    pane.append(
      el(
        'p',
        'area-blurb',
        'No work to be had where you stand — open the Map 地図 tab to walk on.',
      ),
    );
  }
  for (const r of rows) {
    const line = el('div', 'zb-rowline');
    line.append(r.btn);
    if (r.auto) line.append(r.auto);
    pane.append(line);
  }
  container.append(pane);
  return true;
}
/** The area label for a labour row (the ledger's middle column). */
function areaLabelOf(id: string): string {
  return AREAS.find((a) => a.id === id)?.label ?? id;
}

/** The diverged Works 普請 (B / C) — DEV-only, stripped from prod. Default A (the day-book
 *  page) ships inline in render.ts; both alternates re-present the SAME estateBuild/works
 *  reads and drive the REAL improve_estate intent (ADR-075: every variant works). */
function renderWorksVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'works-b' && variantId !== 'works-c') return false;
  const build = estateBuild(state);
  const n = build.next;
  const carried = state.resources.coin ?? 0;
  const banked = state.banked.coin ?? 0;
  const commissionBtn = (): HTMLButtonElement => {
    const btn = el('button', 'verb') as HTMLButtonElement;
    btn.type = 'button';
    btn.addEventListener('click', () => dispatch({ type: 'improve_estate' }));
    if (n) {
      const woodShort = (state.resources.wood ?? 0) < n.def.woodCost;
      btn.textContent = `Commission — ${stageLabel(n.def)} (${formatCoin(n.def.coinCost)} · wood ${n.def.woodCost})`;
      btn.disabled = carried < n.def.coinCost || woodShort || n.deedsShort > 0;
      btn.title = btn.disabled
        ? n.deedsShort > 0
          ? `The house's standing must reach ${n.deedGate} koku first (now ${n.standing})`
          : woodShort
            ? `Needs ${n.def.woodCost} wood`
            : banked >= n.def.coinCost
              ? 'Draw coin from the kura storehouse first'
              : `Needs ${formatCoin(n.def.coinCost)}`
        : '';
    }
    return btn;
  };
  // ADR-177 F3 — a live commission renders as progress (the acts happen at the site).
  const commissionRead = (): HTMLElement | null => {
    if (!n || state.estateCommission !== n.def.stage) return null;
    return el(
      'div',
      'rung-hint',
      `Under way — ${stageLabel(n.def)}: ${state.estateWorkDone} / ${n.def.workActs} (work it at the site)`,
    );
  };
  container.replaceChildren();
  const stageName =
    ESTATE_STAGE_NAMES[state.estateStage] ?? ESTATE_STAGE_NAMES[ESTATE_STAGE_NAMES.length - 1]!;
  if (variantId === 'works-b') {
    // B · THE WORK-SITE BOARD — one card per project, anchored on the zones you walk:
    // the sites carry the discovery state; the open site carries the commissioning.
    const card = el('div', 'rung-card frame works-board');
    card.append(el('div', 'rung-now', `Works 普請 — Estate · ${stageName}`));
    const boardEl = el('div', 'works-board-row');
    for (const proj of WORKS_PROJECTS) {
      const def = ESTATE_STAGES.find((d) => d.stage === proj.stage)!;
      const built = state.estateStage >= proj.stage;
      const isNext = proj.stage === state.estateStage + 1;
      const disc = stageDiscovery(state, proj.stage);
      const site = el(
        'div',
        `works-site ${built ? 'is-built' : isNext ? `is-${disc}` : 'is-faint'}`,
      );
      const kanji = proj.zones.map((z) => getNode(z.node)?.kanji ?? '?').join('');
      site.append(el('div', 'works-site-kanji', kanji));
      if (built) {
        site.append(el('div', 'works-site-name', stageLabel(def)));
        site.append(el('div', 'works-site-note', 'done — the seal holds'));
      } else if (isNext && disc === 'open' && n) {
        site.append(el('div', 'works-site-name', stageLabel(n.def)));
        site.append(el('div', 'works-site-note', stageBlurb(n.def)));
        if (n.deedGate > 0)
          site.append(
            el(
              'div',
              'works-site-note',
              `standing ${Math.min(n.standing, n.deedGate)} / ${n.deedGate} koku`,
            ),
          );
        const read = commissionRead();
        if (read) site.append(read);
        else site.append(commissionBtn());
      } else if (isNext && disc === 'named') {
        site.append(el('div', 'works-site-name is-hint', FLAVOR.worksLadderNamed));
      } else {
        site.append(
          el(
            'div',
            'works-site-name is-hint',
            isNext ? FLAVOR.worksLadderUnnamed : 'the works continue',
          ),
        );
      }
      boardEl.append(site);
    }
    card.append(boardEl);
    container.append(card);
    return true;
  }
  // C · THE BUILD LADDER (interim) — the pre-ADR-177 tracker shape, kept for live comparison.
  const card = el('div', 'rung-card frame');
  card.append(el('div', 'rung-now', `Works 普請 — Estate · ${stageName}`));
  const ladder = el('div', 'build-ladder');
  for (const row of build.rows) {
    const line = el('div', `build-ladder-row is-${row.status}`);
    const nextOpen = n?.open ?? true;
    line.append(
      el(
        'span',
        'build-ladder-mark',
        row.status === 'built' ? '◆' : row.status === 'next' ? '▹' : '▢',
      ),
      el(
        'span',
        'build-ladder-name',
        row.status === 'locked' || (row.status === 'next' && !nextOpen)
          ? 'the works continue'
          : stageLabel(row.def),
      ),
    );
    if (row.status === 'next' && nextOpen && row.deedGate > 0)
      line.append(
        el(
          'span',
          'build-ladder-gauge',
          `standing ${Math.min(state.influence.estate.value, row.deedGate)} / ${row.deedGate} koku`,
        ),
      );
    ladder.append(line);
  }
  card.append(ladder);
  if (n && n.discovery === 'open') {
    card.append(el('div', 'skill-blurb', stageBlurb(n.def)));
    card.append(
      el(
        'div',
        'rung-hint',
        `+${n.def.yieldBonusNum}% labour output · +${n.def.satietyMaxBonus} max body`,
      ),
    );
    const read = commissionRead();
    if (read) card.append(read);
    else card.append(commissionBtn());
  } else if (n) {
    card.append(
      el(
        'div',
        'rung-hint',
        n.discovery === 'named' ? FLAVOR.worksLadderNamed : FLAVOR.worksLadderUnnamed,
      ),
    );
  } else {
    card.append(el('div', 'rung-hint', 'The estate stands restored.'));
  }
  container.append(card);
  return true;
}

/** The diverged Estate 家 house surface (B / C) — DEV-only. Default A (the drawn sheet)
 *  ships inline in render.ts; both alternates re-present the SAME room/standing reads. */
function renderEstateHouseVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
): boolean {
  if (variantId !== 'estate-house-b' && variantId !== 'estate-house-c') return false;
  container.replaceChildren();
  const opened = HOUSE_ROOMS.filter((room) => isUnlocked(state, room.surface));
  if (variantId === 'estate-house-b') {
    // B · THE STEWARD'S RECKONING — the house as day-book lines: each wing a ruled
    // entry, open or shut; the standing as the page's footing.
    const card = el('div', 'rung-card frame estate-reckoning');
    card.append(el('div', 'rung-now', 'Estate 家 · the second reckoning'));
    const page = el('div', 'ledger-page');
    for (const room of HOUSE_ROOMS) {
      const isOpen = isUnlocked(state, room.surface);
      const line = el('div', `ledger-line ${isOpen ? 'is-open' : 'is-faint'}`);
      // P15 — a room not yet reopened stays UNNAMED (a silhouette line, never a preview).
      line.append(
        el('span', 'ledger-rule', isOpen ? '〇' : '▢'),
        el('span', 'ledger-name', isOpen ? `${room.kanji} · ${room.label}` : '————'),
        el('span', 'ledger-note', isOpen ? 'open' : ''),
      );
      page.append(line);
    }
    page.append(
      el(
        'div',
        'ledger-line is-footing',
        `The house stands at ${state.influence.estate.value} koku.`,
      ),
    );
    card.append(page);
    container.append(card);
    return true;
  }
  // C · THE ROOMS LIST (interim) — the pre-ADR-177 shape.
  const card = el('div', 'rung-card frame');
  card.append(el('div', 'rung-now', 'The house reopens 家'));
  const list = el('div', 'house-room-list');
  for (const room of opened) list.append(el('div', 'rung-hint', `${room.kanji} · ${room.label}`));
  if (opened.length === 0) list.append(el('div', 'rung-hint', 'The inner house waits, shuttered.'));
  card.append(list);
  container.append(card);
  return true;
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
  const restB = cornerRestBonus(state); // the corner's property (FB-409 — restRefill applies it only AT the corner)
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

// ── the DEV panel — a floating, collapsible control surface (DEV-only) ──

/** The subset of `window.__qa` the panel drives. main.ts's qa object satisfies this
 *  structurally; the panel never sees the rest of __qa. */
export interface DevQa {
  /** Live state, for the FB-7 balance cockpit's §5 live-feedback readouts (rung/capstone ETA, etc.). */
  state(): GameState;
  speed(mult: number): number;
  jumpToPhase2(): unknown;
  jumpToAscension(): void;
  toRung(id: RankId): unknown;
  newGame(seed?: number): void;
  /** FB-96 save-backup safety net: `hasBackup` gates the "goto last backup" button; `restoreBackup`
   *  rewinds to the pre-New-game snapshot. Both async (they hit the redundant storage backends). */
  hasBackup(): Promise<boolean>;
  restoreBackup(): Promise<boolean>;
  /** FB-6 scenario saves: load a NAMED fixture (backup-first) + list the available scenarios. */
  loadFixture(name: string): Promise<unknown>;
  fixtures(): ReadonlyArray<{ name: string; blurb: string; group: string }>;
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
    // F136 — bottom .25rem matches the footer's --space-1 padding, so the collapsed
    // DEV chip bottom-aligns with the Settings button beside it. FB-162 — the right
    // inset tracks the CENTRED shell's edge (max-width 1440), not the viewport corner,
    // so on wide screens the chip sits inside the frame, not out in the whitespace.
    // FB-302 — widened 24rem → 30rem (with the 3-up tab rows) so section rows breathe.
    'position:fixed;bottom:.25rem;right:max(.75rem, calc(50vw - 720px + .75rem));z-index:9999;width:fit-content;max-width:30rem;max-height:82vh;' +
    'display:flex;flex-direction:column;overflow:hidden;' +
    'background:#1c1814;color:#e7d9bc;font:12px/1.45 ui-monospace,SFMono-Regular,monospace;' +
    'border:1px solid #b08d4f;border-radius:4px;box-shadow:0 2px 14px rgba(0,0,0,.45);';

  // header (click to collapse the body) — fixed (never scrolls)
  const head = el('div');
  // FB-149 — collapsed, the chip must PIXEL-match the footer Settings button:
  // 26px head + the panel's 2×1px border = 28px total (= --tap-min), bottoms
  // aligned by the .25rem panel inset (the footer's --space-1 padding).
  head.style.cssText =
    'flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;' +
    'height:26px;box-sizing:border-box;padding:0 .5rem;' +
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
    // FB-302 — expanded width 15rem → 24rem (the human: wider, with three-up tab rows).
    panel.style.width = hidden ? '24rem' : 'fit-content';
    // FB-308 — expanded height is FIXED (never grows/shrinks with the active tab — a short
    // pane just leaves whitespace); collapsed reverts to the head-only auto height.
    panel.style.height = hidden ? 'min(42rem, 82vh)' : '';
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

  // FB-121 (ADR-137 Phase 4) — the requirements CHEATLIST pane: the current rung's hidden
  // list with live progress (the human's debugging window; the player only ever sees the %).
  const rungsPane = el('div');
  rungsPane.style.cssText = `display:none;flex-direction:column;gap:.4rem;${paneScroll}`;

  // FB-305 — a seventh pane: the PROTOTYPES shelf. The six `⤢` full-screen launchers (maps,
  // graphics explorations) lived at the top of Story and drowned the diverge bundles; they're
  // review artifacts, not story, so they get their own tab (grouped per FB-306 below).
  const protosPane = el('div');
  protosPane.style.cssText = `display:none;flex-direction:column;gap:.2rem;${paneScroll}`;

  const tabBtn = (label: string): HTMLButtonElement => {
    const b = el('button', undefined, label);
    b.type = 'button';
    // FB-302 — THREE tabs per row inside the wrapping bar (was 40% / two); nowrap keeps each
    // label on one line. FB-311 — the basis is FIXED (flex-grow 0), so a lone tab on the last
    // row (Balance) stays one cell wide instead of stretching across the row.
    b.style.cssText =
      'flex:0 0 calc((100% - .5rem)/3);box-sizing:border-box;white-space:nowrap;border:1px solid #7a6c59;' +
      'border-radius:3px;padding:.2rem .4rem;font:inherit;cursor:pointer;font-weight:700;';
    return b;
  };
  type TabId = 'settings' | 'variants' | 'scenarios' | 'balance' | 'story' | 'rungs' | 'protos';
  const settingsTab = tabBtn('Settings');
  const variantsTab = tabBtn('Variants');
  const scenariosTab = tabBtn('Scenarios');
  const balanceTab = tabBtn('Balance');
  const storyTab = tabBtn('Story');
  // FB-304 — "Rungs" read like the Rung teleports; it's the requirements cheatlist, so "Rung info".
  const rungsTab = tabBtn('Rung info');
  const protosTab = tabBtn('Prototypes');
  const tabs: Record<TabId, { tab: HTMLButtonElement; pane: HTMLElement }> = {
    settings: { tab: settingsTab, pane: settingsPane },
    variants: { tab: variantsTab, pane: variantsPane },
    scenarios: { tab: scenariosTab, pane: scenariosPane },
    balance: { tab: balanceTab, pane: balancePane },
    story: { tab: storyTab, pane: storyPane },
    rungs: { tab: rungsTab, pane: rungsPane },
    protos: { tab: protosTab, pane: protosPane },
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
  // FB-303 — Balance LAST (the human's least-reached pane); FB-302's 3-up rows make the order
  // Settings · Variants · Scenarios / Story · Rung info · Prototypes / Balance.
  tabBar.append(settingsTab, variantsTab, scenariosTab, storyTab, rungsTab, protosTab, balanceTab);
  body.append(
    tabBar,
    settingsPane,
    variantsPane,
    scenariosPane,
    balancePane,
    storyPane,
    rungsPane,
    protosPane,
  );

  const cheatlist = mountRequirementsCheatlist(rungsPane, qa.state);
  // refresh the cheatlist whenever its tab is selected + on a slow tick while visible
  rungsTab.addEventListener('click', () => cheatlist.refresh());
  setInterval(() => {
    if (rungsPane.style.display !== 'none') cheatlist.refresh();
  }, 1000);

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

  // FB-264 — the action hover-detail inspector: hovering any timed action button shows what it
  // WILL pay (effective yields/xp via activityForecast — AC-6) + its timing. The render-side card
  // reads body[data-dev-act-hover]; the pref survives reload (ui-prefs seam). Default OFF.
  const inspect = section('Inspect');
  let hoverOn = loadActionHover();
  const applyHover = (): void => {
    if (hoverOn) document.body.dataset.devActHover = '1';
    else delete document.body.dataset.devActHover;
    hoverBtn.textContent = `action detail: ${hoverOn ? 'on' : 'off'}`;
    hoverBtn.style.background = hoverOn ? '#b08d4f' : '#3a322a';
    hoverBtn.style.color = hoverOn ? '#1c1814' : '#e7d9bc';
  };
  const hoverBtn = mono('action detail: off', () => {
    hoverOn = !hoverOn;
    saveActionHover(hoverOn);
    applyHover();
  });
  inspect.append(hoverBtn);
  applyHover();

  // (The UI-v2 temp-toggle section lived here through the migration; RETIRED with
  // the human's PH5 certification, 2026-07-06 — attr palette locked 'temper'; the
  // open variant picks live in the Variants pane, not here.)

  // teleports
  const jump = section('Jump');
  jump.append(mono('→ Phase 2', () => qa.jumpToPhase2()));
  jump.append(mono('→ Ascend-ready', () => qa.jumpToAscension()));
  // FB-68 — a button for EVERY rung in the roster (source of truth: RANKS/ranks.ts), not a partial
  // set. Clicking LOADS that rung's hidden `rung-RX` scenario (human, 2026-07-07): the old `toRung`
  // teleport left an INCOHERENT run (applyPromotion-only — no real unlocks/panels/resources for the
  // rung), so it read as broken; the fixture is the REAL climb driven to the first tick at that
  // rung, a coherent state in EITHER direction. Backup-first (like every Load), so it's non-destructive.
  // The CURRENT rung reads highlighted (the gold #b08d4f idiom); id + kanji on the face, English title
  // in the tooltip.
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
      void Promise.resolve(qa.loadFixture(`rung-${r.id}`)).then(() => {
        markRung(qa.selectors.rung());
        enableRestore();
      });
    });
    b.title = r.title;
    rungBtns.set(r.id, b);
    rungs.append(b);
  }
  markRung(qa.selectors.rung()); // highlight the rung the game is currently at

  // (The Combat/Auto section — Auto: farm / Auto: monkey / Stop auto — was RETIRED here
  // (FB-300): the in-game auto-toggles are the real feature, and the headless `__qa.auto` /
  // `__qa.autoCombat` drive methods remain the QA path; the buttons earned nothing.)

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
  //    (rung beats + intro scenes + generalized scene-defs — season-exit/scripted beats) +
  //    UI flavor lines (lock-hints) — dialogue/cold-open units read in the script-reader. ──
  storyTab.textContent =
    dev.storyBundles.length > 0 ? `Story (${dev.storyBundles.length})` : 'Story';
  // FB-310 — Variants carries its open-surface count too, mirroring Story's badge.
  variantsTab.textContent =
    dev.surfaces.length > 0 ? `Variants (${dev.surfaces.length})` : 'Variants';
  // (FB-228/HR-22 — the MC-colour swatch trio lived here 2026-07-10 for the taste call;
  // the human LOCKED A · asagi sky #8ec9ff same day, so the toggle is stripped — the
  // pick IS the styles.css --v-player token, zero flag-debt. Git history keeps the trio.)
  // ── FB-305/FB-306 — the PROTOTYPES pane: the six `⤢` full-screen launchers, moved out of
  //    Story (they drowned the diverge bundles) and grouped by shelf. The per-button history
  //    comments ride along:
  //    · Map sheets — T0/T1 review maps (2026-07-07 story reboot): the rebooted tier-sheet
  //      zone rosters as full-screen survey sheets, read-only, self-contained in map-sheets/
  //      (T0 + T1 side by side on purpose; T2 the valley downstream).
  //    · New UI — E3 stamp book (fable-2026-07-08-graphics-explorations.md; fixture-fed) and
  //      E1 estate sheet (okoshi-ezu cutaway, STANDALONE of map-sheets — spec in
  //      src/ui/estate-sheet/README.md, HR-16). Prototype-first law: zero game integration.
  //    · Parked — E2 scene-card pilots, human-parked 2026-07-08 with BOTH versions kept as
  //      concept references: v2 (kage-e + press — the kept look) and v1 (figurative — ruled slop).
  const protoGroup = (title: string): void => {
    const hdr = el('div', undefined, title);
    hdr.style.cssText =
      'font-weight:700;color:#b08d4f;text-transform:uppercase;letter-spacing:.05em;font-size:10px;' +
      `margin-top:${protosPane.childElementCount === 0 ? '0' : '.5rem'};padding-bottom:.15rem;border-bottom:1px solid #b08d4f;margin-bottom:.2rem;`;
    protosPane.append(hdr);
  };
  const protoBtn = (label: string, open: () => void): void => {
    const b = mono(label, open);
    b.style.cssText += 'margin-bottom:.2rem;text-align:left;';
    protosPane.append(b);
  };
  protoGroup('Map sheets');
  protoBtn('⤢ T1 map — the estate at its true scale', () => openT1Map());
  protoBtn('⤢ T2 map — the valley, Asagiri downstream', () => openT2Map());
  protoGroup('New UI (E3 / E1)');
  protoBtn('⤢ Stamp book — E3 progression prototype', () => openStampBook());
  protoBtn('⤢ Estate sheet — E1 okoshi-ezu prototype', () => openEstateSheet());
  protoGroup('Parked UI prototypes');
  protoBtn('⤢ Scene cards v2 — kage-e (E2 · parked)', () => openSceneCards());
  protoBtn('⤢ Scene cards v1 — figurative (E2 · parked)', () => openSceneCardsV1());

  if (dev.storyBundles.length === 0) {
    const empty = el('div', undefined, 'No open story diverges — nothing awaiting review.');
    empty.style.cssText = 'color:#9b8e78;padding:.3rem .1rem;';
    storyPane.append(empty);
  }
  // ONE explore page per diverge (human, 2026-07-07): each bundle section below carries
  // its OWN "⤢ Explore" link — no combined all-bundles modal.
  // FB-307 — rung-ordered with `— rung RX —` headers, mirroring the Variants pane: bundles
  // sort by the rung a player first meets them (authored as `rung:` in bundle.md). FB-312 —
  // NO catch-all "other" group: a rungless bundle carries its own `rungReason`, and each
  // distinct reason renders as its own `— other · <reason> —` header (reason'd bundles sort
  // after the numbered rungs, in registry order).
  // SV-numbering (mirrors the Variants pane's V-tags, FB-36) — per-BUNDLE, assigned in
  // REGISTRY order (storyBundles[0]=SV0, [1]=SV1, …) so a tag stays pinned to its bundle: it
  // never shifts when the pane rung-reorders rows or an earlier bundle is pruned on sign-off.
  // Each take then reads `SV{n}{LETTER}` (canon = `SV{n}·Canon`), so the human can reference a
  // story take as tersely as a UI variant ("lock SV12A"). Computed once, read into the labels below.
  const stag = new Map<string, string>();
  dev.storyBundles.forEach((b, bi) => stag.set(b.id, `SV${bi}`));

  const bundleHeader = (b: StoryTakeBundle): string =>
    b.rung !== undefined ? `— rung R${b.rung} —` : `— other · ${b.rungReason ?? '?'} —`;
  const rungOrderedBundles = dev.storyBundles
    .slice()
    .sort((a, b) => (a.rung ?? 99) - (b.rung ?? 99));
  let shownBundleHeader: string | undefined;
  for (const bundle of rungOrderedBundles) {
    if (bundleHeader(bundle) !== shownBundleHeader) {
      shownBundleHeader = bundleHeader(bundle);
      const rh = el('div', undefined, shownBundleHeader);
      rh.style.cssText =
        'color:#b08d4f;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin:.35rem 0 .1rem;opacity:.85;';
      storyPane.append(rh);
    }
    const sec = el('div');
    sec.style.cssText = 'border:1px solid #3a322a;border-radius:3px;padding:.28rem .4rem;';
    const title = el('div', undefined, `${stag.get(bundle.id)} · ${bundle.title}`);
    title.style.cssText = 'color:#b08d4f;text-transform:uppercase;font-size:11px;';
    sec.append(title);
    const explore = mono('⤢ Explore this diverge', () => {
      openStoryReader(bundle, dev);
    });
    explore.style.cssText += 'margin:.2rem 0;';
    sec.append(explore);

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
    // every option carries its textual label + SV-tag — canon included (human, 2026-07-07).
    const st = stag.get(bundle.id);
    takeBtn('canon', `${st}·Canon — ${bundle.canonLabel ?? 'the pick'}`);
    for (const t of bundle.takes) takeBtn(t.id, `${st}${t.id.toUpperCase()} — ${t.label}`);
    sec.append(setRow, brief);
    // Per-unit overrides moved to the per-diverge explore page (human, 2026-07-07) —
    // this section stays focused: the labeled set toggle + the explore link.
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

  // Rung-ordered (2026-07-09) — surfaces sort by the RUNG a player first meets them, so the
  // Variants tab tracks a rung-by-rung QA (mirrors review.md's rung grouping). A rung header
  // lands whenever the rung changes; V-tags stay REGISTRY-ordered (above), so they never shift.
  const rungOrdered = dev.surfaces.slice().sort((a, b) => (a.rung ?? 99) - (b.rung ?? 99));
  let shownRung: number | undefined;
  let firstRow = true;
  for (const surface of rungOrdered) {
    if (firstRow || surface.rung !== shownRung) {
      shownRung = surface.rung;
      firstRow = false;
      const rh = el(
        'div',
        undefined,
        surface.rung !== undefined ? `— rung R${surface.rung} —` : '— other —',
      );
      rh.style.cssText =
        'color:#b08d4f;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin:.35rem 0 .1rem;opacity:.85;';
      variantsPane.append(rh);
    }
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

  // default active sub-tab = Settings (FB-298 — the human's most-reached pane; was Variants)
  selectTab('settings');

  // FB-34/FB-37 — a PERMANENT New-game footer, TRULY fixed at the bottom of the panel column
  // (flex:0 0 auto, outside the scrolling panes) so it's reachable no matter which sub-tab is
  // active OR how far the variants scroll. FB-38 — this is now the SOLE New-game control (the old
  // duplicate in the Settings→Game section was removed).
  // FB-96 — the footer stacks two half-width rows: "goto last backup" ABOVE "New game". A flex COLUMN
  // so the buttons stack; each button is width:50% + align-self:flex-start (left-anchored).
  const footer = el('div');
  // FB-309 — a 2×2 grid (was a stacked column) so the footer spends one less row and the
  // scrolling panes above get the space; the FB-95 half-width accident guard holds (each
  // cell is half the panel).
  footer.style.cssText =
    'flex:0 0 auto;margin-top:.15rem;padding-top:.4rem;border-top:1px solid #7a6c59;' +
    'display:grid;grid-template-columns:1fr 1fr;gap:.25rem;';

  // FB-96 — "goto last backup": restores the snapshot New game takes before it wipes the run. Starts
  // DISABLED (dimmed) and is enabled once a backup exists — either found on mount (a prior session)
  // or created the moment New game is pressed.
  const restoreBtn = mono('↩ last backup', () => {
    if (!restoreBtn.disabled) void qa.restoreBackup();
  });
  restoreBtn.disabled = true;
  restoreBtn.style.opacity = '.45';
  restoreBtn.style.cursor = 'not-allowed';
  const enableRestore = (): void => {
    restoreBtn.disabled = false;
    restoreBtn.style.opacity = '1';
    restoreBtn.style.cursor = 'pointer';
  };
  footer.append(restoreBtn);

  // FB-6 — populate the Scenarios pane: one row per fixture (name · blurb · Load), GROUPED into
  // game-progression sections with a header per section (human, 2026-07-07 — qa.fixtures() sorts
  // earliest-first + filters the hidden rung-start set). loadFixture is backup-first (it snapshots
  // the current run to the FB-96 slot), so a load can never destroy the human's real save — lighting
  // "↩ last backup" is the way home. The sentinel stamps the pane so the strip gate (gh-pages.sh)
  // can grep-prove these DEV bytes never ship (Ph3, R2).
  scenariosPane.dataset.sentinel = FIXTURES_SENTINEL;
  let lastGroup: string | null = null;
  for (const { name, blurb, group } of qa.fixtures()) {
    if (group !== lastGroup) {
      const hdr = el('div', undefined, group);
      hdr.style.cssText =
        'font-weight:700;color:#b08d4f;text-transform:uppercase;letter-spacing:.05em;font-size:10px;' +
        `margin-top:${lastGroup === null ? '0' : '.5rem'};padding-bottom:.15rem;border-bottom:1px solid #b08d4f;`;
      scenariosPane.append(hdr);
      lastGroup = group;
    }
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
  newGameFooterBtn.style.fontWeight = '700';
  footer.append(newGameFooterBtn);
  // FB-301 — "NG (post open)": a fresh run with the cold open already answered — loads the
  // FB-6 `post-cold-open` fixture (backup-first like every Load, so it's non-destructive).
  const ngPostBtn = mono('⟳ NG (post open)', () => {
    void Promise.resolve(qa.loadFixture('post-cold-open')).then(() => enableRestore());
  });
  footer.append(ngPostBtn);
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

  // ── boot params: `?t1-map-demo` / `?t2-map-demo` open the review sheet straight
  //    from the URL (human, 2026-07-08 — a shareable "look at the map" link that
  //    skips the Story-tab click path). Lives HERE, not main.ts, so it rides the
  //    DEV fold: no panel (prod, `?dev=no`) → no param. First one wins. T0 has no
  //    demo entry since the real Map tab ships it (FB-364); QA captures go through
  //    openTierMap('T0').
  {
    const boot = new URLSearchParams(location.search);
    if (boot.has('t1-map-demo')) openT1Map();
    else if (boot.has('t2-map-demo')) openT2Map();
  }
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
    for (const k of Object.keys(t.scenes ?? {})) keys.add(`scene:${k}`);
    for (const k of Object.keys(t.rungBeats ?? {})) keys.add(`rung:${k}`);
    for (const d of t.dialogues ?? []) keys.add(`dialogue:${d.id}`);
    for (const k of Object.keys(t.flavor ?? {})) keys.add(`flavor:${k}`);
    for (const k of Object.keys(t.reqFlavor ?? {})) keys.add(`req-flavor:${k}`);
    // FB-362 — the intro 幕-head labels, keyed by scene id (canon reads the scene's title).
    for (const k of Object.keys(t.introTitles ?? {})) keys.add(`intro-title:${k}`);
  }
  // a req-flavor bundle reads as the WHOLE ladder: include every registry requirement,
  // canon-only ones too (their alternate columns show "no take — canon plays"), so a
  // rung's section is its complete set, never just the diverged subset.
  if (bundle.takes.some((t) => t.reqFlavor)) {
    for (const reqs of Object.values(RUNG_REQUIREMENTS)) {
      for (const r of reqs) keys.add(`req-flavor:${r.id}`);
    }
  }
  const order = (k: string): number =>
    k.startsWith('cold-open:')
      ? 0
      : k.startsWith('intro:') || k.startsWith('intro-title:')
        ? 1
        : k.startsWith('scene:')
          ? 2
          : k.startsWith('rung:')
            ? 2
            : k.startsWith('flavor:')
              ? 4
              : k.startsWith('req-flavor:')
                ? 5
                : 3;
  // req-flavor keys order by their REGISTRY placement (rung, then authored position),
  // never alphabetically — the explore page reads as the ladder.
  const sub = (k: string): number =>
    k.startsWith('req-flavor:')
      ? (reqFlavorPlacement(k.slice('req-flavor:'.length))?.order ?? 9999)
      : 0;
  return [...keys].sort((a, b) => order(a) - order(b) || sub(a) - sub(b) || a.localeCompare(b));
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
  if (kind === 'scene') {
    // generalized scene-defs (season-exit / scripted VN beats) — canon reads the LIVE
    // SCENES registry by id; a take carries only the RungScene body in `scenes`.
    const s = take === 'canon' ? sceneById(key)?.scene : take.scenes?.[key];
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
  if (kind === 'flavor') {
    const text = take === 'canon' ? (FLAVOR as Record<string, string>)[key] : take.flavor?.[key];
    return text ? [{ voice: 'narrator', text, kind: 'line' }] : null;
  }
  if (kind === 'intro-title') {
    // FB-362 — the scene's 幕-head label; canon reads the LIVE scene's `title:` (intro.gen).
    const text =
      take === 'canon' ? DIALOGUE_SCENES.find((x) => x.id === key)?.title : take.introTitles?.[key];
    return text ? [{ voice: 'narrator', text: `— ${text} —`, kind: 'line' }] : null;
  }
  if (kind === 'req-flavor') {
    // FB-121 requirement-completion lines — canon reads the LIVE registry by requirement id.
    const text =
      take === 'canon'
        ? Object.values(RUNG_REQUIREMENTS)
            .flat()
            .find((r) => r.id === key)?.flavor
        : take.reqFlavor?.[key];
    return text ? [{ voice: 'narrator', text, kind: 'line' }] : null;
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

// FB-121 req-flavor placement: units group PER RUNG (human, 2026-07-07 — the explore
// page reads as the ladder, not 23 flat items), ordered by rung then authored position.
function reqFlavorPlacement(reqId: string): { section: string; order: number } | null {
  const rungs = Object.keys(RUNG_REQUIREMENTS) as (keyof typeof RUNG_REQUIREMENTS)[];
  for (let r = 0; r < rungs.length; r++) {
    const reqs = RUNG_REQUIREMENTS[rungs[r]!];
    const i = reqs.findIndex((x) => x.id === reqId);
    if (i >= 0) {
      const rank = getRank(rungs[r]!);
      return { section: `${rungs[r]} · ${rank.title} ${rank.kanji}`, order: r * 100 + i };
    }
  }
  return null;
}

// Unit kinds that swap LIVE in the running game (rung/intro/flavor at render time;
// req-flavor via the CORE overlay — ADR-139: every diverge unit reviews in the switcher).
// dialogue + cold-open pin only the READER's display today (takes/README: wiring the
// live-swap is part of diverging one).
// cold-open: only the RENDER-READ title-card keys swap live (subColdOpen); the
// core-emitted keys (rake/haul/daybook…) stay reader-only — logged history never
// rewrites (T2), and the intro-reused keys ride their scene's own intro: swap.
// intro-title: FB-362 — live via the CORE overlay (__setIntroTitleOverride): a fresh
// intro run's 幕-heads voice the selected take; logged history keeps its baked heads.
const LIVE_UNITS = /^(rung|intro|intro-title|scene|flavor|req-flavor):|^cold-open:(lede|cta)$/;

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
function renderReaderGalley(host: HTMLElement, bundle: StoryTakeBundle, dev?: DevApi): void {
  let lastSection: string | null = null;
  for (const unit of readerUnitsOf(bundle)) {
    // grouped sections (req-flavor groups per rung; other kinds are groupless today):
    // a heading lands whenever the section changes — the page reads as the ladder.
    const section = unit.startsWith('req-flavor:')
      ? (reqFlavorPlacement(unit.slice('req-flavor:'.length))?.section ?? null)
      : null;
    if (section !== null && section !== lastSection) {
      const sh = el('div', undefined, section);
      sh.style.cssText =
        'margin:2rem 0 .2rem;font-weight:700;color:var(--gold, #b08d4f);' +
        'letter-spacing:.08em;text-transform:uppercase;font-size:13px;' +
        'border-bottom:1px solid var(--ink-faint);padding-bottom:.3rem;';
      host.append(sh);
    }
    lastSection = section;
    // the per-unit override lives HERE, beside the unit it pins (human, 2026-07-07 —
    // the DEV panel section stays a clean set toggle). '·' = follow the bundle set.
    let extra: HTMLElement | undefined;
    if (dev) {
      extra = el('div');
      extra.style.cssText = 'display:flex;gap:.25rem;align-items:center;';
      const uBtns = new Map<string | undefined, HTMLButtonElement>();
      const uRefresh = (): void => {
        const cur = dev.getStoryUnit(bundle.id, unit);
        for (const [id, b] of uBtns) {
          const on = id === cur;
          b.style.background = on ? 'var(--gold, #b08d4f)' : 'transparent';
          b.style.color = on ? '#1c1814' : 'var(--ink, #e7d9bc)';
        }
      };
      const uBtn = (id: string | undefined, label: string, title: string): void => {
        const b = el('button', undefined, label) as HTMLButtonElement;
        b.type = 'button';
        b.title = title;
        b.style.cssText =
          'border:1px solid var(--ink-faint);border-radius:3px;padding:.05rem .35rem;' +
          'font:inherit;font-size:11px;cursor:pointer;background:transparent;color:var(--ink);';
        b.addEventListener('click', () => {
          dev.setStoryUnit(bundle.id, unit, id);
          uRefresh();
        });
        uBtns.set(id, b);
        extra!.append(b);
      };
      uBtn(undefined, '·', 'follow the bundle set');
      uBtn('canon', `canon — ${bundle.canonLabel ?? 'the pick'}`, 'pin this unit to canon');
      for (const t of bundle.takes) uBtn(t.id, t.id.toUpperCase(), `${t.id} — ${t.label}`);
      uRefresh();
    }
    const chipLabel = unit.startsWith('req-flavor:') ? unit.slice('req-flavor:'.length) : unit;
    readerUnitHeader(host, LIVE_UNITS.test(unit) ? chipLabel : `${chipLabel} (reader-only)`, extra);
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
    cell(readerChip(`canon · ${bundle.canonLabel ?? 'the pick'}`, 'pick'), canonLines);
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
export function openStoryReader(bundle: StoryTakeBundle, dev?: DevApi): HTMLElement {
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
  // ONE explore page per diverge (human, 2026-07-07) — the page IS the bundle. The SV-tag
  // (bundle's registry index) mirrors the panel so the human can reference this diverge tersely.
  const si = dev ? dev.storyBundles.findIndex((b) => b.id === bundle.id) : -1;
  const roman = el(
    'span',
    undefined,
    `Explore story — ${si >= 0 ? `SV${si} · ` : ''}${bundle.title}`,
  );
  roman.className = 'roman';
  title.append(kami, roman);
  card.append(title);

  // galley-only since FB-125 (HR-9 ✅ — the human picked Galley columns firm).
  // the ONE scrolling region (FB-123) — the frame + title above never move.
  const content = el('div');
  content.style.cssText =
    'flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:.5rem;margin-top:1rem;';
  if (bundle.review) {
    const rv = el('div', undefined, `review doc: ${bundle.review}`);
    rv.style.cssText = 'color:var(--ink-faint);font-size:12px;';
    content.append(rv);
  }
  renderReaderGalley(content, bundle, dev);
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

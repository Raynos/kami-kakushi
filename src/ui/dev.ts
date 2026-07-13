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

import { type GameState, type Intent, type RankId } from '../core';
import { el } from './render';
// ADR-139 story take-sets — imported ONLY here, so the registry rides this module's DEV fold.
import { STORY_TAKE_BUNDLES, type StoryTakeBundle } from './storyTakes';
import { __setStoryOverlay, storyText, type IntroSetupLine } from '../core';
import type { RungScene } from '../core/content/rungBeats';
import type { DialogueScene } from '../core/content/intro';
import { mountBalanceCockpit, type BalanceCockpit } from './dev-cockpit';
import { mountRequirementsCheatlist } from './dev-cheatlist';
import { openT1Map, openT2Map } from './map-sheets/sheet';
// ── the render-split module set (2026-07-13): the panel is a SHELL (chrome / tab bar /
//    footer) over per-pane modules in dev/ — plus the take-sub helpers, the ADR-075
//    alternate variant renderers, and the ADR-139 script-reader, split alongside. ──
import { mono, tabBtn, isAwaitingVerdict, DEV_SENTINEL } from './dev/widgets';
import { unitOfKey, overlayScene } from './dev/take-subs';
import { renderSurfaceVariant } from './dev/variant-renderers';
import { buildSettingsPane } from './dev/settings-pane';
import { buildVariantsPane } from './dev/review-variants-pane';
import { buildStoryPane } from './dev/review-story-pane';
import { buildScenariosPane } from './dev/scenarios-pane';
import { buildProtosPane } from './dev/protos-pane';
// Re-exported so main.ts builds the cockpit THROUGH ui/dev — keeping dev-cockpit.ts imported only
// here, riding this module's DEV fold + sentinel graph (FB-7 / ADR-059).
export { createBalanceCockpit, buildTuneArtifact } from './dev-cockpit';
export type { BalanceCockpit, TuneMeta, TouchedLever, LeverDef } from './dev-cockpit';
// Re-exported (render-split): the reader + the strip-guard sentinel keep their './dev' home.
export { openStoryReader, LIVE_UNITS } from './dev/story-reader';
export { DEV_SENTINEL } from './dev/widgets';

// The diverged-surface REGISTRY moved to `dev-surfaces.ts` (2026-07-13): a gate has to read it,
// and a gate script cannot import this module (the fixtures pane pulls in `import.meta.glob`).
// Re-exported here so every existing importer — and the renderer's variant routing — is unmoved.
import { SURFACES, type SurfaceDef } from './dev-surfaces';
export { SURFACES, type SurfaceDef, type VariantDef } from './dev-surfaces';

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
  /** HD-41 — substitute a requirement's PROGRESS-tab objective line with the active take's
   *  version (identity when everything is 'canon'). Render-read, not core-emitted: the log
   *  paints the Progress view from the registry, so a flip re-reads every visible line. */
  subReqObjective(id: string, canon: string): string;
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

  // step B (session-200) — the ONE story overlay: flatten the EFFECTIVE takes'
  // gen-canonicalized text maps + narration-run sequences and push them into the core
  // in one call. Every reader (emit-time, save-load, the DEV log repaint, the render-read
  // surfaces) consults storyText/storySeq — this replaced the eleven per-concern setters
  // this function used to hand-mirror. Recomputed on every set/unit change; all-canon
  // clears it.
  const syncStoryOverlay = (): void => {
    const text: Record<string, string> = {};
    const seq: Record<string, readonly IntroSetupLine[]> = {};
    for (const b of bundles) {
      for (const t of b.takes) {
        for (const [key, v] of Object.entries(t.text ?? {})) {
          if (effective(b.id, unitOfKey(key)) === t.id) text[key] = v;
        }
        for (const [key, v] of Object.entries(t.seq ?? {})) {
          if (effective(b.id, unitOfKey(key)) === t.id) seq[key] = v;
        }
      }
    }
    const any = Object.keys(text).length + Object.keys(seq).length > 0;
    __setStoryOverlay(any ? text : null, any && Object.keys(seq).length > 0 ? seq : null);
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
    // a MODE surface's pick lives in its declaring module, not in `variant[]` — so hydrate it
    // too, or a shared `?zone-reveal=…` link would show the toggle flipped and play the default.
    for (const s of SURFACES) s.apply?.(variant[s.id] ?? defaultOf(s.id));
    // story sets ride the same channel: `?story-<bundle>=<take>` (guarded like variants).
    for (const b of bundles) {
      const q = params.get(`story-${b.id}`);
      if (q && validTake(b.id, q)) storyTake[b.id] = q;
    }
  }

  syncStoryOverlay(); // honour a ?story-<bundle>= URL selection from the first emission

  return {
    getVariant: (s) => variant[s] ?? defaultOf(s),
    setVariant: (s, id) => {
      variant[s] = id;
      SURFACES.find((sf) => sf.id === s)?.apply?.(id); // MODE surfaces (ADR-184 zone-reveal)
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
      syncStoryOverlay();
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
        syncStoryOverlay();
        return;
      }
      if (!validTake(b, id)) return;
      (unitOverride[b] ??= {})[unit] = id;
      storyEpoch++;
      syncStoryOverlay();
    },
    storyEpoch: () => storyEpoch,
    // step B2 (session-200) — the render-read subs all read the SAME overlay the core
    // does (syncStoryOverlay pushed the effective takes there): scene shapes rebuild
    // with take words on canon structure (identity when nothing is covered — the VN
    // keeps its object-equality fast paths), flat classes are one lookup.
    subRungScene: (scene) =>
      scene.rank === undefined ? scene : overlayScene(`beat.${scene.rank}`, scene),
    subIntroScene: (scene) => overlayScene(`intro.${scene.id}`, scene),
    subScene: (scene) => overlayScene(`scene.${scene.id}`, scene),
    subFlavor: (key, canon) => storyText(`flavor.${key}`) ?? canon,
    subReqObjective: (id, canon) => storyText(`req-objective.${id}`) ?? canon,
    subColdOpen: (key, canon) => storyText(`cold-open.${key}`) ?? canon,
  };
}

// ── the DEV panel — a floating, collapsible control surface (DEV-only) ──

/** The subset of `window.__qa` the panel drives. main.ts's qa object satisfies this
 *  structurally; the panel never sees the rest of __qa. */
export interface DevQa {
  /** Live state, for the FB-7 balance cockpit's §5 live-feedback readouts (rung/capstone ETA, etc.). */
  state(): GameState;
  speed(mult: number): number;
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
  // Drag the panel by its ⚙ DEV header (human, session-200 — review ergonomics: pull the
  // panel off whatever it covers, the same idiom as the FB-3 feedback box's startDrag).
  // The first real movement (>4px) converts the bottom/right anchor to left/top so the
  // panel follows the pointer; a plain press-and-release stays a click (collapse/expand).
  // Session-local — the panel re-seats at its corner on reload, like the feedback box.
  let headDragged = false;
  head.addEventListener('pointerdown', (e: PointerEvent) => {
    const r = panel.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const onMove = (ev: PointerEvent): void => {
      if (!headDragged && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 4) return;
      headDragged = true;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      // clamp: the header stays grabbable — the panel can never leave the screen entirely.
      const maxL = Math.max(0, window.innerWidth - 60);
      const maxT = Math.max(0, window.innerHeight - 26);
      panel.style.left = `${Math.min(maxL, Math.max(0, r.left + (ev.clientX - sx)))}px`;
      panel.style.top = `${Math.min(maxT, Math.max(0, r.top + (ev.clientY - sy)))}px`;
    };
    const onUp = (): void => {
      document.removeEventListener('pointermove', onMove, true);
      document.removeEventListener('pointerup', onUp, true);
    };
    document.addEventListener('pointermove', onMove, true);
    document.addEventListener('pointerup', onUp, true);
  });
  head.addEventListener('click', () => {
    if (headDragged) {
      headDragged = false; // a drag's release is not a collapse click
      return;
    }
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'flex' : 'none';
    caret.textContent = hidden ? '▾' : '▸';
    // FB-302 — expanded width 15rem → 24rem (the human: wider, with three-up tab rows).
    panel.style.width = hidden ? '24rem' : 'fit-content';
    // FB-308 — expanded height is FIXED (never grows/shrinks with the active tab — a short
    // pane just leaves whitespace); collapsed reverts to the head-only auto height.
    panel.style.height = hidden ? 'min(42rem, 82vh)' : '';
  });

  // ── sub-tab bar: one pane per capability, under one sub-header (TST1). Each tab shows its
  //    pane and hides the others; default = Settings (FB-298). ──
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
  // ── THE REVIEW PANE (2026-07-13, the human: "move all the things I need to review into
  //    one place"). Everything awaiting a human VERDICT lives here — the ADR-075 UI variants
  //    and the ADR-139 story takes — switched by the segmented row below, NOT by hunting two
  //    tabs. The two idioms stay visually separate (a UI variant is a pane swap; a story take
  //    is a whole coherent set) but they share one home: TST1, one home for everything.
  //    The pane itself does NOT scroll — the switch row is pinned and each sub-pane scrolls. ──
  const reviewPane = el('div');
  reviewPane.style.cssText =
    'display:none;flex-direction:column;gap:.3rem;flex:1 1 auto;min-height:0;overflow:hidden;';
  const reviewSwitch = el('div');
  reviewSwitch.style.cssText = 'flex:0 0 auto;display:flex;gap:.25rem;';
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
  // ADR-139 — the STORY take-set switcher: the narrative sibling of the UI-variant toggle
  // (the human's lock: "variants & story variants as different elements in the DEV menu" —
  // still true, they are different ELEMENTS; as of 2026-07-13 they are two halves of the ONE
  // Review pane rather than two tabs). The script-reader modal is the full-diverge surface,
  // not this switcher.
  const storyPane = el('div');
  storyPane.style.cssText = `display:none;flex-direction:column;gap:.4rem;${paneScroll}`;
  reviewPane.append(reviewSwitch, variantsPane, storyPane);

  // FB-121 (ADR-137 Phase 4) — the requirements CHEATLIST pane: the current rung's hidden
  // list with live progress (the human's debugging window; the player only ever sees the %).
  const rungsPane = el('div');
  rungsPane.style.cssText = `display:none;flex-direction:column;gap:.4rem;${paneScroll}`;

  // FB-305 — a seventh pane: the PROTOTYPES shelf. The six `⤢` full-screen launchers (maps,
  // graphics explorations) lived at the top of Story and drowned the diverge bundles; they're
  // review artifacts, not story, so they get their own tab (grouped per FB-306 below).
  const protosPane = el('div');
  protosPane.style.cssText = `display:none;flex-direction:column;gap:.2rem;${paneScroll}`;

  type TabId = 'settings' | 'review' | 'scenarios' | 'balance' | 'rungs' | 'protos';
  const settingsTab = tabBtn('Settings');
  const reviewTab = tabBtn('Review');
  const scenariosTab = tabBtn('Scenarios');
  const balanceTab = tabBtn('Balance');
  // FB-304 — "Rungs" read like the Rung teleports; it's the requirements cheatlist, so "Rung info".
  const rungsTab = tabBtn('Rung info');
  const protosTab = tabBtn('Prototypes');
  const tabs: Record<TabId, { tab: HTMLButtonElement; pane: HTMLElement }> = {
    settings: { tab: settingsTab, pane: settingsPane },
    review: { tab: reviewTab, pane: reviewPane },
    scenarios: { tab: scenariosTab, pane: scenariosPane },
    balance: { tab: balanceTab, pane: balancePane },
    rungs: { tab: rungsTab, pane: rungsPane },
    protos: { tab: protosTab, pane: protosPane },
  };

  // the Review pane's own switch — which HALF of the review queue is showing. The counts ride
  // the buttons (a badge on the tab alone can't say "13 of these are story"), and the picked
  // half is the gold one, matching every other selected-state in this panel.
  type ReviewHalf = 'variants' | 'story';
  const halves: Record<ReviewHalf, { btn: HTMLButtonElement; pane: HTMLElement }> = {
    variants: { btn: tabBtn('Variants'), pane: variantsPane },
    story: { btn: tabBtn('Story'), pane: storyPane },
  };
  const selectHalf = (which: ReviewHalf): void => {
    for (const id of Object.keys(halves) as ReviewHalf[]) {
      const { btn, pane } = halves[id];
      const on = id === which;
      pane.style.display = on ? 'flex' : 'none';
      btn.style.background = on ? '#b08d4f' : '#3a322a';
      btn.style.color = on ? '#1c1814' : '#e7d9bc';
    }
  };
  for (const id of Object.keys(halves) as ReviewHalf[]) {
    const { btn, pane } = halves[id];
    // the switch sits INSIDE a pane, so it must be half-width, not the tab bar's 3-up cell
    btn.style.flex = '1 1 0';
    btn.dataset.reviewHalf = id; // stable hooks: the switch and the tab bar both render <button>s
    pane.dataset.reviewPane = id;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectHalf(id);
    });
    reviewSwitch.append(btn);
  }
  selectHalf('variants');
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
    tabs[id].tab.dataset.devTab = id;
    tabs[id].tab.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTab(id);
    });
  }
  // FB-303 — Balance LAST (the human's least-reached pane); FB-302's 3-up rows make the order
  // Settings · Review · Scenarios / Rung info · Prototypes · Balance (six tabs, two full rows —
  // folding Story into Review cost a tab and bought an even grid).
  tabBar.append(settingsTab, reviewTab, scenariosTab, rungsTab, protosTab, balanceTab);
  body.append(tabBar, settingsPane, reviewPane, scenariosPane, balancePane, rungsPane, protosPane);

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
  // The Settings pane's sections (Speed / Inspect / Save health / Telemetry) live in
  // dev/settings-pane.ts; the orphan sensor badges the Settings tab itself.
  buildSettingsPane({ pane: settingsPane, tab: settingsTab, qa });
  // ── ADR-139 — the STORY pane: one block per OPEN narrative-diverge bundle. Coarse
  //    set-switch (Canon / take …) keeps a whole coherent take live so pacing reads true;
  //    per-unit override rows below mix within the set. Swaps are display-only (takes are
  //    state-compatible) and re-render immediately; live swap covers the VN scene types
  //    (rung beats + intro scenes + generalized scene-defs — season-exit/scripted beats) +
  //    UI flavor lines (lock-hints) — dialogue/cold-open units read in the script-reader. ──
  // FB-310 — each half carries its own open count; the Review TAB carries the total, so the
  // collapsed panel answers "how much is waiting on me" without opening anything. The count is
  // what AWAITS A VERDICT (2026-07-13): a settled bundle kept as reference still renders, but
  // counting it would make the badge lie about the size of the queue.
  const openUi = dev.surfaces.filter((s) => isAwaitingVerdict(s.hr)).length;
  const openStory = dev.storyBundles.filter((b) => isAwaitingVerdict(b.hr)).length;
  halves.story.btn.textContent = openStory > 0 ? `Story (${openStory})` : 'Story';
  halves.variants.btn.textContent = openUi > 0 ? `Variants (${openUi})` : 'Variants';
  reviewTab.textContent = openUi + openStory > 0 ? `Review (${openUi + openStory})` : 'Review';
  // (FB-228/HR-22 — the MC-colour swatch trio lived here 2026-07-10 for the taste call;
  // the human LOCKED A · asagi sky #8ec9ff same day, so the toggle is stripped — the
  // pick IS the styles.css --v-player token, zero flag-debt. Git history keeps the trio.)
  // The Prototypes shelf lives in dev/protos-pane.ts (FB-305/FB-306).
  buildProtosPane({ pane: protosPane });
  // The Review halves live in dev/review-story-pane.ts (ADR-139 takes) and
  // dev/review-variants-pane.ts (ADR-075 variants).
  buildStoryPane({ pane: storyPane, dev, rerender });
  buildVariantsPane({ pane: variantsPane, dev, rerender });

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

  // The Scenarios pane (FB-6 fixtures) lives in dev/scenarios-pane.ts; every Load is
  // backup-first, so it lights the footer's "↩ last backup".
  buildScenariosPane({ pane: scenariosPane, qa, enableRestore });

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

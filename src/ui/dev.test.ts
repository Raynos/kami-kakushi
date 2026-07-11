// @vitest-environment jsdom
//
// Step 1 (v0.3.1, ADR-075): the variant-toggle infra. The renderer reads a DEV-only
// `variant: Record<surface,id>` and renders the chosen variant of a diverged surface; nothing
// in src/core branches on it. These RED-able tests prove the routing — a non-default selection
// swaps the House-Influence grade visual, and the default (= prod, where `dev` is undefined)
// renders A. (RED-able: if the seam stopped honouring the selection, or always rendered A, the
// B/C asserts flip red; if it always delegated, the prod-default assert flips red.)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount, type AppHooks } from './render';
import { createActionClock } from '../app/action-clock';
import {
  createDevApi,
  mountDevPanel,
  createBalanceCockpit,
  openStoryReader,
  type DevQa,
} from './dev';
import type { StoryTakeBundle } from './storyTakes';
import { STORY_TAKE_BUNDLES } from './storyTakes';
import type { RungScene } from '../core/content/rungBeats';
import { RUNG_BEATS } from '../core/content/rungBeats';

/** A minimal balance cockpit for the panel-mount tests (FB-7 — the Balance sub-tab is required opts). */
const testCockpit = () =>
  createBalanceCockpit({
    meta: () => ({
      build: 'test',
      seed: 1,
      clock: { day: 0, tick: 0 },
      capturedAt: '1970-01-01T00:00:00.000Z',
    }),
  });
import {
  createInitialState,
  getBelonging,
  setFlag,
  factsForSurfaces,
  type GameState,
  type Intent,
  type RankId,
  rungRequirements,
  requirementFlavor,
  __setRequirementFlavorOverride,
} from '../core';

function noopHooks(): AppHooks {
  let muted = false;
  return {
    exportSave: () => 'SAVE',
    importSave: () => {},
    newGame: () => {},
    setReducedMotion: () => {},
    setTextScale: () => {},
    togglePause: () => false,
    sfx: {
      hit: () => {},
      reward: () => {},
      rankUp: () => {},
      setMuted: (b: boolean) => {
        muted = b;
      },
      isMuted: () => muted,
    },
    clock: createActionClock(),
  };
}

/** A Phase-2 state with the live House-Influence pillar — phaseOf===2 needs R7 + t0-capstone
 *  (ranks.ts). IA reorg (ADR-112 §8.3): the koku panel MOVED from Work to the Estate 家 tab, so it
 *  shows once `panel-house-influence` is unlocked AND the Estate tab is active. ADR-179 — both it
 *  and `tab-estate` (R6 rewards, Schedule A) derive from the rank-r6 fact; readout-rice derives
 *  from `awake` + intro-done (a fresh state's introBeat is pre-wake, so intro-done holds). */
function livingInfluenceState(value = 300): GameState {
  const base = createInitialState(1);
  return {
    ...base,
    rung: 'R7',
    flags: {
      ...base.flags,
      awake: true,
      't0-capstone': true,
      'rank-r7': true,
      ...factsForSurfaces('tab-estate', 'panel-house-influence'),
    },
    influence: { estate: { value, highWater: value, judged: 0 } },
  };
}

describe('createDevApi — the variant registry + selection', () => {
  it('defaults each surface to its first variant (the self-picked prod default)', () => {
    const dev = createDevApi();
    expect(dev.getVariant('influence')).toBe('influence-a');
  });
  it('setVariant switches the live selection', () => {
    const dev = createDevApi();
    dev.setVariant('influence', 'influence-b');
    expect(dev.getVariant('influence')).toBe('influence-b');
  });
  // ADR-075 zero-flag-debt — the workspace layout+framing pick is LOCKED (byōbu + soft cards), so the
  // `layout`/`framing` variant surfaces were PRUNED. RED-able: if either toggle surface returned, the
  // registry would carry it again (and the prod default would stop being the sole rendering).
  it('no longer registers the pruned layout/framing surfaces', () => {
    const dev = createDevApi();
    const ids = dev.surfaces.map((s) => s.id);
    expect(ids).not.toContain('layout');
    expect(ids).not.toContain('framing');
  });
});

describe('renderer variant routing — House-Influence grade (D-075)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    // jsdom has no matchMedia — the renderer probes prefers-reduced-motion.
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    root = document.createElement('div');
    document.body.append(root);
  });

  // IA reorg (ADR-112 §8.3) — the koku standing lives on the Estate 家 tab now; activate it before
  // asserting the variant routing (the panel self-gates to `activeTab === 'estate'`).
  function openEstate(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('家'))
      ?.click();
  }

  it('renders default A (continuous bar) when no DEV harness is present (= the prod path)', () => {
    const render = mount(root, () => {}, noopHooks()); // dev undefined → prod path
    render(livingInfluenceState(), null);
    openEstate();
    expect(root.querySelector('.influence-bar')).not.toBeNull();
    expect(root.querySelector('.influence-seg')).toBeNull();
    expect(root.querySelector('.influence-marks')).toBeNull();
  });

  it('routes to variant B (segmented bands) when selected', () => {
    const dev = createDevApi();
    dev.setVariant('influence', 'influence-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(livingInfluenceState(), null);
    openEstate();
    expect(root.querySelector('.influence-seg')).not.toBeNull();
    expect(root.querySelector('.influence-bar')).toBeNull();
  });

  it('routes to variant C (standing marks) when selected', () => {
    const dev = createDevApi();
    dev.setVariant('influence', 'influence-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(livingInfluenceState(), null);
    openEstate();
    expect(root.querySelector('.influence-marks')).not.toBeNull();
    expect(root.querySelector('.influence-bar')).toBeNull();
  });

  it('falls back to A when the DEV harness selects the default explicitly', () => {
    const dev = createDevApi(); // default = influence-a
    const render = mount(root, () => {}, noopHooks(), dev);
    render(livingInfluenceState(), null);
    openEstate();
    expect(root.querySelector('.influence-bar')).not.toBeNull();
    expect(root.querySelector('.influence-seg')).toBeNull();
  });
});

describe('renderer variant routing — Works 普請 + Estate 家 (ADR-177 Phase 2, D-075)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    root = document.createElement('div');
    document.body.append(root);
  });

  /** An R2+ state with the works chain open through U1 (named + priced). ADR-179 —
   *  panel-estate derives from the `works-named-u1` fact already stamped below, and
   *  readout-rice from `awake` + intro-done; no stored latch to seed. */
  function worksState(): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      rung: 'R2',
      flags: {
        ...base.flags,
        awake: true,
        'works-named-u1': true,
        'works-seen-u1': true,
        'works-open-u1': true,
      },
      resources: { ...base.resources, coin: 500 },
    };
  }
  function estateHouseState(): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      rung: 'R6',
      // ADR-179 — tab-estate/house-workshops (R6) + house-omoya (R4) derive from rank facts.
      flags: {
        ...base.flags,
        awake: true,
        ...factsForSurfaces('tab-estate', 'house-omoya', 'house-workshops'),
      },
    };
  }
  const openTab = (label: string): void => {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes(label))
      ?.click();
  };

  it('Works: default A (the day-book page) renders with no DEV harness (= prod)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(worksState(), null);
    openTab('普請');
    expect(root.querySelector('.works-ledger .ledger-page')).not.toBeNull();
    expect(root.querySelector('.works-board')).toBeNull();
  });

  it('Works: routes to B (work-site board) when selected — and its button drives the REAL intent', () => {
    const dev = createDevApi();
    dev.setVariant('works', 'works-b');
    const intents: string[] = [];
    const render = mount(root, (i) => void intents.push(i.type), noopHooks(), dev);
    render(worksState(), null);
    openTab('普請');
    expect(root.querySelector('.works-board-row')).not.toBeNull();
    expect(root.querySelector('.works-ledger')).toBeNull();
    const btn = [...root.querySelectorAll<HTMLButtonElement>('.works-board button.verb')][0];
    expect(btn).toBeDefined();
    btn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(intents).toContain('improve_estate'); // ADR-075: every variant WORKS
  });

  it('Works: routes to C (the interim build ladder) when selected', () => {
    const dev = createDevApi();
    dev.setVariant('works', 'works-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(worksState(), null);
    openTab('普請');
    expect(root.querySelector('.build-ladder')).not.toBeNull();
    expect(root.querySelector('.works-ledger')).toBeNull();
  });

  it('Estate 家: default A (the drawn sheet) renders with no DEV harness (= prod)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(estateHouseState(), null);
    openTab('家');
    expect(root.querySelector('.estate-sheet-svg')).not.toBeNull();
    expect(root.querySelector('.estate-reckoning')).toBeNull();
  });

  it('Estate 家: routes to B (the steward’s reckoning) when selected', () => {
    const dev = createDevApi();
    dev.setVariant('estate-house', 'estate-house-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(estateHouseState(), null);
    openTab('家');
    expect(root.querySelector('.estate-reckoning')).not.toBeNull();
    expect(root.querySelector('.estate-sheet-svg')).toBeNull();
  });

  it('Estate 家: routes to C (the interim rooms list) when selected', () => {
    const dev = createDevApi();
    dev.setVariant('estate-house', 'estate-house-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(estateHouseState(), null);
    openTab('家');
    expect(root.querySelector('.house-room-list')).not.toBeNull();
    expect(root.querySelector('.estate-sheet-svg')).toBeNull();
  });
});

describe('renderer variant routing — Bestiary (D-075, A7)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    root = document.createElement('div');
    document.body.append(root);
  });

  /** Combat live at the paddies with the Bestiary revealed and the monkey faced (so a real entry
   *  inks in for every take, not just fog). */
  function bestiaryState(): GameState {
    const base = createInitialState(1);
    return setFlag(
      {
        ...base,
        location: 'home-paddies',
        // ADR-179 — the combat tab + Bestiary derive from their rung fact (rank-r3).
        flags: { ...base.flags, awake: true, ...factsForSurfaces('tab-combat', 'panel-bestiary') },
      },
      'mob-monkey',
    );
  }
  // IA reorg (ADR-112) — the Bestiary SPLIT OUT of renderCombat onto the Character 己 tab (it sits with
  // the character sheet now, not the fight surface), so the DEV variant host resolves under Character.
  function openCharacter(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('己'))
      ?.click();
  }

  it('renders default A (field-guide cards) with no DEV harness (= prod)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(bestiaryState(), null);
    openCharacter();
    expect(root.querySelector('.bestiary-card')).not.toBeNull();
    expect(root.textContent).not.toContain('危険帳'); // not the danger ledger
    expect(root.textContent).not.toContain('The beasts of the estate'); // not the scroll
  });

  it('routes to bestiary-b (danger ledger) when selected — a ranked ink table, not the cards', () => {
    const dev = createDevApi();
    dev.setVariant('bestiary', 'bestiary-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(bestiaryState(), null);
    openCharacter();
    expect(root.querySelector('.bestiary-card')).toBeNull(); // the default is replaced
    expect(root.textContent).toContain('Danger ledger');
    expect(root.textContent).toContain('危険帳');
  });

  it('routes to bestiary-c (図鑑 scroll) when selected — diegetic entries, not the cards', () => {
    const dev = createDevApi();
    dev.setVariant('bestiary', 'bestiary-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(bestiaryState(), null);
    openCharacter();
    expect(root.querySelector('.bestiary-card')).toBeNull();
    expect(root.textContent).toContain('The beasts of the estate');
  });
});

// ADR-111 / FB-89 — the HOME / belongings panel diverge (ADR-075). A (the functional list) ships inline
// in render.ts; B (一間 room cutaway) / C (持ち物帳 ledger) live DEV-only. Every variant re-presents
// the SAME home data (header, owned belongings + comfort, the live comfort tally, the buyable
// acquire list) and every buy button drives the REAL `buy_belonging` intent. These RED-able tests
// hold the routing (a non-default selection swaps the presentation) + the wired-verb contract.
describe('renderer variant routing — Home / belongings (D-075, D-111)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    root = document.createElement('div');
    document.body.append(root);
  });

  // the home granted (panel-home) + coin in the purse (so a comfort piece is affordable — the buy
  // button is live). ADR-179 — the grants are the entitling FACTS: rank-r4 reveals tab-inventory,
  // which carries panel-home (ADR-177 Schedule A); panel-estate rides `works-named-u1`; the
  // rank-r1 flag covers the ladder panel + rooms; readout-rice derives from awake + intro-done.
  function homeState(extra?: Partial<GameState>): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      flags: {
        ...base.flags,
        awake: true,
        raked: true,
        'rank-r1': true,
        ...factsForSurfaces('panel-rung-ladder', 'panel-estate', 'panel-home', 'tab-inventory'),
      },
      resources: { ...base.resources, coin: 500 },
      ...extra,
    };
  }
  function openInventory(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('Inventory'))
      ?.click();
  }

  it('renders default A (functional list) with no DEV harness (= prod)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(homeState(), null);
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    // the shipped list: the .belonging-row rows, and NEITHER the cutaway NOR the ledger frames.
    expect(pane.querySelector('.belonging-row')).not.toBeNull();
    expect(pane.querySelector('.home-room')).toBeNull();
    expect(pane.querySelector('.home-ledger')).toBeNull();
    expect(root.textContent).not.toContain('持ち物帳');
  });

  it('routes to home-b (一間 room cutaway) when selected — the room, not the list', () => {
    const dev = createDevApi();
    dev.setVariant('home', 'home-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(homeState(), null);
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    expect(pane.querySelector('.home-room')).not.toBeNull(); // the diegetic room grid
    expect(pane.querySelector('.belonging-row')).toBeNull(); // the default list is replaced
    // the bowl + mat are placed IN SITU in the room (owned belongings render as room pieces).
    expect(pane.querySelector('.home-piece[data-belonging="bowl"]')).not.toBeNull();
    // the acquire list reads as "what the room still lacks".
    expect(pane.textContent).toContain('What the room still lacks');
  });

  it('routes to home-c (持ち物帳 ledger) when selected — the register, not the list', () => {
    const dev = createDevApi();
    dev.setVariant('home', 'home-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(homeState(), null);
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    expect(pane.querySelector('.home-ledger')).not.toBeNull();
    expect(pane.querySelector('.belonging-row')).toBeNull();
    expect(pane.textContent).toContain('持ち物帳');
    // owned pieces are ruled ledger lines (the bowl among them).
    expect(pane.querySelector('.home-ledger-row[data-belonging="bowl"]')).not.toBeNull();
  });

  it('the room-cutaway comfort tally reads the SAME numbers as the default (A6)', () => {
    const dev = createDevApi();
    dev.setVariant('home', 'home-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(homeState({ belongings: ['bedding'] }), null); // a bought futon → rest +5 in effect
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    const amt = getBelonging('bedding').comfort?.amount ?? 0;
    expect(amt).toBeGreaterThan(0);
    // the tally is read through the SAME selectors the reducer uses — not a copied magic number.
    expect(pane.querySelector('.home-cutaway-tally')?.textContent).toContain(`rest +${amt}`);
  });

  it('a DEV-variant buy button drives the REAL buy_belonging intent', () => {
    const dev = createDevApi();
    dev.setVariant('home', 'home-c');
    const dispatched: Intent[] = [];
    const render = mount(root, (i) => dispatched.push(i), noopHooks(), dev);
    render(homeState(), null);
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    // an UNFILLED ledger line for a buyable piece; its verb button dispatches the real intent.
    const row = pane.querySelector<HTMLElement>('.home-unfilled-row[data-belonging="bedding"]')!;
    expect(row).not.toBeNull();
    row.querySelector<HTMLButtonElement>('button')!.click();
    expect(dispatched).toContainEqual({ type: 'buy_belonging', belongingId: 'bedding' });
  });
});

// FB-49 — the DEV Speed row: 1·2·4·8·16, active multiplier highlighted (gold #b08d4f bg), default 1×.
describe('DEV panel — Speed row (F49)', () => {
  function stubQa(): DevQa & { last: number | null } {
    const q = {
      last: null as number | null,
      state: () => createInitialState(1),
      speed(m: number) {
        q.last = m;
        return m;
      },
      jumpToPhase2: () => 0,
      jumpToAscension: () => {},
      toRung: () => 0,
      newGame: () => {},
      hasBackup: async () => false,
      restoreBackup: async () => false,
      loadFixture: async () => ({ ok: true }),
      fixtures: () => [],
      selectors: { rung: () => 'R0' as RankId },
    };
    return q;
  }
  function speedButtons(host: HTMLElement): HTMLButtonElement[] {
    return [...host.querySelectorAll('button')].filter((b) =>
      /^\d+×$/.test(b.textContent ?? ''),
    ) as HTMLButtonElement[];
  }
  // the active button carries the gold bg + bold weight (jsdom normalises the hex to rgb, so key
  // off the bold weight the highlight also stamps on — set to '700' active, 'normal' otherwise).
  const isActive = (b: HTMLButtonElement): boolean => b.style.fontWeight === '700';

  it('offers 1·2·4·8·16 (16× is present)', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, {
      qa: stubQa(),
      dev: createDevApi(),
      rerender: () => {},
      cockpit: testCockpit(),
    });
    const labels = speedButtons(host).map((b) => b.textContent);
    expect(labels).toEqual(['1×', '2×', '4×', '8×', '16×']);
    host.remove();
  });

  it('highlights 1× by default and no other', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, {
      qa: stubQa(),
      dev: createDevApi(),
      rerender: () => {},
      cockpit: testCockpit(),
    });
    const btns = speedButtons(host);
    const active = btns.filter(isActive);
    expect(active).toHaveLength(1);
    expect(active[0]!.textContent).toBe('1×');
    host.remove();
  });

  it('clicking a speed drives qa.speed and moves the highlight to only that button', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const qa = stubQa();
    mountDevPanel(host, { qa, dev: createDevApi(), rerender: () => {}, cockpit: testCockpit() });
    const btns = speedButtons(host);
    const four = btns.find((b) => b.textContent === '4×')!;
    four.click();
    expect(qa.last).toBe(4);
    const active = btns.filter(isActive);
    expect(active).toHaveLength(1);
    expect(active[0]!.textContent).toBe('4×');
    host.remove();
  });
});

// FB-95 — the New-game footer button is HALF WIDTH + left-anchored so an accidental double-click on
// the compact dev menu can't land on it (the right half of the row is deliberately empty).
describe('DEV panel — New-game footer safety (F95)', () => {
  function stubQa(over: Partial<DevQa> = {}): DevQa {
    return {
      state: () => createInitialState(1),
      speed: (m: number) => m,
      jumpToPhase2: () => 0,
      jumpToAscension: () => {},
      toRung: () => 0,
      newGame: () => {},
      hasBackup: async () => false,
      restoreBackup: async () => false,
      loadFixture: async () => ({ ok: true }),
      fixtures: () => [],
      selectors: { rung: () => 'R0' as RankId },
      ...over,
    };
  }
  const btnByText = (host: HTMLElement, needle: string): HTMLButtonElement =>
    [...host.querySelectorAll('button')].find((b) =>
      (b.textContent ?? '').includes(needle),
    ) as HTMLButtonElement;

  it('renders the New-game button as ONE cell of the 2-col footer grid (not full width)', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, {
      qa: stubQa(),
      dev: createDevApi(),
      rerender: () => {},
      cockpit: testCockpit(),
    });
    const btn = btnByText(host, 'New game');
    expect(btn).toBeTruthy();
    // FB-309 — the footer is a 2×2 grid; the F95 accident guard holds because each cell is
    // half the panel, so a stray double-click beside the button still misses it.
    const footer = btn.parentElement!;
    expect(footer.style.display).toBe('grid');
    expect(footer.style.gridTemplateColumns).toBe('1fr 1fr');
    expect(btn.style.width).toBe(''); // no full-width override — the cell bounds it
    host.remove();
  });

  it('renders "goto last backup" ABOVE New game, disabled until a backup exists', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, {
      qa: stubQa(),
      dev: createDevApi(),
      rerender: () => {},
      cockpit: testCockpit(),
    });
    const restore = btnByText(host, 'last backup');
    const newGame = btnByText(host, 'New game');
    expect(restore).toBeTruthy();
    // DOM order: restore precedes New game (compareDocumentPosition FOLLOWING = 4).
    expect(
      restore.compareDocumentPosition(newGame) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // no backup yet (stub hasBackup=false) → disabled.
    expect(restore.disabled).toBe(true);
    host.remove();
  });

  it('pressing New game backs up (via qa.newGame) and enables the restore button', () => {
    const host = document.createElement('div');
    document.body.append(host);
    let newGames = 0;
    mountDevPanel(host, {
      qa: stubQa({ newGame: () => void newGames++ }),
      dev: createDevApi(),
      rerender: () => {},
      cockpit: testCockpit(),
    });
    const restore = btnByText(host, 'last backup');
    const newGame = btnByText(host, 'New game');
    expect(restore.disabled).toBe(true);
    newGame.click();
    expect(newGames).toBe(1);
    expect(restore.disabled).toBe(false); // a backup now exists → restore is live
    host.remove();
  });

  it('clicking the enabled restore button drives qa.restoreBackup', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    let restored = 0;
    // hasBackup=true so the mount probe enables the button.
    mountDevPanel(host, {
      qa: stubQa({ hasBackup: async () => true, restoreBackup: async () => (restored++, true) }),
      dev: createDevApi(),
      rerender: () => {},
      cockpit: testCockpit(),
    });
    await Promise.resolve(); // let the async hasBackup probe settle
    const restore = btnByText(host, 'last backup');
    expect(restore.disabled).toBe(false);
    restore.click();
    expect(restored).toBe(1);
    host.remove();
  });
});

// ── ADR-139 — the story take-set switcher: substitution routing. Bundles are INJECTED (the
// suite never depends on which real diverges happen to be open). RED-able: if the seam stopped
// honouring the set pick, always substituted, or let the per-unit override lose to the set,
// the asserts below flip red. ──
describe('ADR-139 story take-sets', () => {
  function stubQa(): DevQa {
    return {
      state: () => createInitialState(1),
      speed: (m: number) => m,
      jumpToPhase2: () => 0,
      jumpToAscension: () => {},
      toRung: () => 0,
      newGame: () => {},
      hasBackup: async () => false,
      restoreBackup: async () => false,
      loadFixture: async () => ({ ok: true }),
      fixtures: () => [],
      selectors: { rung: () => 'R0' as RankId },
    };
  }
  const btnByText = (host: HTMLElement, needle: string): HTMLButtonElement =>
    [...host.querySelectorAll('button')].find((b) =>
      (b.textContent ?? '').includes(needle),
    ) as HTMLButtonElement;

  const scene = (text: string): RungScene => ({
    id: 'rung-r1',
    rank: 'R1' as RankId,
    voice: 'steward',
    greeting: [{ voice: 'narrator', text }],
    topics: [],
    decision: { prompt: 'p?', options: [{ id: 'o1', label: 'l', say: 's', react: 'r' }] },
    motivates: [],
  });
  const canon = scene('canon line');
  const altB = scene('take-b line');
  const bundle: StoryTakeBundle = {
    id: 'test-bundle',
    title: 'Test bundle',
    takes: [
      { id: 'b', label: 'Colder', brief: 'withholds warmth', rungBeats: { R1: altB } },
      { id: 'c', label: 'Warmer', brief: 'lets the weariness show' },
    ],
  };

  it('substitutes nothing while everything is canon (identity)', () => {
    const dev = createDevApi([bundle]);
    expect(dev.getStoryTake('test-bundle')).toBe('canon');
    expect(dev.subRungScene(canon)).toBe(canon);
  });

  it('substitutes the selected take, and falls back to canon when the take lacks the unit', () => {
    const dev = createDevApi([bundle]);
    dev.setStoryTake('test-bundle', 'b');
    expect(dev.subRungScene(canon)).toBe(altB);
    dev.setStoryTake('test-bundle', 'c'); // take c carries no rungBeats → canon shows
    expect(dev.subRungScene(canon)).toBe(canon);
  });

  it('per-unit override beats the bundle set, and clears back to the set', () => {
    const dev = createDevApi([bundle]);
    dev.setStoryTake('test-bundle', 'b');
    dev.setStoryUnit('test-bundle', 'rung:R1', 'canon');
    expect(dev.subRungScene(canon)).toBe(canon);
    dev.setStoryUnit('test-bundle', 'rung:R1', undefined);
    expect(dev.subRungScene(canon)).toBe(altB);
  });

  it('rejects an unknown take id (set + unit)', () => {
    const dev = createDevApi([bundle]);
    dev.setStoryTake('test-bundle', 'nope');
    expect(dev.getStoryTake('test-bundle')).toBe('canon');
    dev.setStoryUnit('test-bundle', 'rung:R1', 'nope');
    expect(dev.getStoryUnit('test-bundle', 'rung:R1')).toBeUndefined();
  });

  // ADR-139 — generalized scene-defs (season-exit / scripted VN beats) swap LIVE too, keyed
  // by scene id via `dev.subScene` (the nengu-autumn-frame diverge, HD-30). Same set-switch
  // path as rung/intro scenes: identity on canon, swaps the take, falls back when absent.
  const sceneDef = (text: string): RungScene => ({
    id: 'nengu-autumn-frame',
    voice: 'narrator',
    greeting: [{ voice: 'narrator', text }],
    topics: [],
    decision: { prompt: '', options: [] },
    motivates: [],
  });
  const sceneCanon = sceneDef('canon reckoning');
  const sceneAltA = sceneDef('take-a reckoning');
  const sceneBundle: StoryTakeBundle = {
    id: 'scene-bundle',
    title: 'Scene bundle',
    takes: [
      {
        id: 'a',
        label: 'Chiyo',
        brief: 'the arithmetic of dignity',
        scenes: { 'nengu-autumn-frame': sceneAltA },
      },
      { id: 'b', label: 'Ledger', brief: 'the day-book register' },
    ],
  };

  it('subScene: identity on canon, swaps the selected take, falls back when absent', () => {
    const dev = createDevApi([sceneBundle]);
    expect(dev.subScene(sceneCanon)).toBe(sceneCanon); // all-canon → identity
    dev.setStoryTake('scene-bundle', 'a');
    expect(dev.subScene(sceneCanon)).toBe(sceneAltA); // take a carries the scene
    dev.setStoryTake('scene-bundle', 'b');
    expect(dev.subScene(sceneCanon)).toBe(sceneCanon); // take b lacks it → canon shows
  });

  it('subScene: per-unit override beats the set and clears back', () => {
    const dev = createDevApi([sceneBundle]);
    dev.setStoryTake('scene-bundle', 'a');
    dev.setStoryUnit('scene-bundle', 'scene:nengu-autumn-frame', 'canon');
    expect(dev.subScene(sceneCanon)).toBe(sceneCanon);
    dev.setStoryUnit('scene-bundle', 'scene:nengu-autumn-frame', undefined);
    expect(dev.subScene(sceneCanon)).toBe(sceneAltA);
  });

  // PH6 / verify-don't-trust — the REAL generated registry, not a fixture: the HD-30 nengu
  // diverge must compile end-to-end (compiler → storyTakes.gen → dev API) and swap the actual
  // authored take. RED if the bundle is pruned/renamed or the scene-def emit path regresses.
  it('subScene: the real hd30-nengu bundle swaps the authored nengu scene', () => {
    const nengu = STORY_TAKE_BUNDLES.find((b) => b.id === 'hd30-nengu');
    expect(nengu, 'hd30-nengu bundle present in the generated registry').toBeDefined();
    const takeA = nengu!.takes.find((t) => t.id === 'a');
    const authored = takeA?.scenes?.['nengu-autumn-frame'];
    expect(authored, 'take a carries a nengu-autumn-frame scene body').toBeDefined();
    const dev = createDevApi(STORY_TAKE_BUNDLES);
    const liveCanon: RungScene = {
      id: 'nengu-autumn-frame',
      voice: 'narrator',
      greeting: [{ voice: 'narrator', text: 'canon' }],
      topics: [],
      decision: { prompt: '', options: [] },
      motivates: [],
    };
    expect(dev.subScene(liveCanon)).toBe(liveCanon); // canon set → identity
    dev.setStoryTake('hd30-nengu', 'a');
    expect(dev.subScene(liveCanon)).toBe(authored); // take a → the authored body
  });

  // ADR-139 — UI flavor lines swap LIVE too (a lock-hint diverge like HR-10), not reader-only.
  const flavorBundle: StoryTakeBundle = {
    id: 'flav',
    title: 'Flavor bundle',
    takes: [
      { id: 'a', label: 'A', brief: 'names the smith', flavor: { mendHint: 'take-a line' } },
      { id: 'b', label: 'B', brief: 'no flavor unit' }, // b carries no flavor → canon shows
    ],
  };
  it('subFlavor: canon identity, swaps the selected take, falls back when the take lacks the key', () => {
    const dev = createDevApi([flavorBundle]);
    expect(dev.subFlavor('mendHint', 'CANON')).toBe('CANON'); // all canon → identity
    dev.setStoryTake('flav', 'a');
    expect(dev.subFlavor('mendHint', 'CANON')).toBe('take-a line');
    expect(dev.subFlavor('otherKey', 'CANON')).toBe('CANON'); // take a lacks this key
    dev.setStoryTake('flav', 'b'); // take b carries no flavor → canon shows
    expect(dev.subFlavor('mendHint', 'CANON')).toBe('CANON');
  });

  it('mounts a Story tab that lists the open bundle and badges the count', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, {
      qa: stubQa(),
      dev: createDevApi([bundle]),
      rerender: () => {},
      cockpit: testCockpit(),
    });
    const storyTab = btnByText(host, 'Story (1)');
    expect(storyTab).toBeTruthy();
    storyTab.click();
    expect(host.textContent).toContain('Test bundle');
    expect(host.textContent).toContain('B — Colder');
    host.remove();
  });
});

// ── ADR-139 — the script-reader modal (galley-only since FB-125 / HR-9 ✅): RED-able
// routing proofs. jsdom-level: the galley renders canon (from the LIVE registry) beside the
// takes; canon-identical take lines DIM (FB-124); Escape dismisses. Visual taste was scored
// on real screenshots in the HR-9 flow, not here. ──
describe('FB-121 req-flavor — the CORE overlay rides the switcher', () => {
  const bundle: StoryTakeBundle = {
    id: 'req-test',
    title: 'Req flavor test',
    takes: [
      {
        id: 'b',
        label: 'alt voice',
        brief: 'the alternate register',
        reqFlavor: { 'rake-the-spill': 'ALT rake line' },
      },
    ],
  };
  const rakeReq = rungRequirements('R0').find((r) => r.id === 'rake-the-spill')!;

  afterEach(() => __setRequirementFlavorOverride(null));

  it('selecting a take overlays FUTURE emissions; canon restores on switch-back', () => {
    const dev = createDevApi([bundle]);
    expect(requirementFlavor(rakeReq)).toBe(rakeReq.flavor); // canon by default
    dev.setStoryTake('req-test', 'b');
    expect(requirementFlavor(rakeReq)).toBe('ALT rake line'); // the core read swapped
    dev.setStoryTake('req-test', 'canon');
    expect(requirementFlavor(rakeReq)).toBe(rakeReq.flavor); // cleared, not stuck
  });

  it('a per-unit override wins over the bundle set (and clears)', () => {
    const dev = createDevApi([bundle]);
    dev.setStoryUnit('req-test', 'req-flavor:rake-the-spill', 'b');
    expect(requirementFlavor(rakeReq)).toBe('ALT rake line');
    dev.setStoryUnit('req-test', 'req-flavor:rake-the-spill', undefined);
    expect(requirementFlavor(rakeReq)).toBe(rakeReq.flavor);
  });
});

describe('ADR-139 story reader modal', () => {
  const scene = (text: string, react: string): RungScene => ({
    id: 'rung-r1',
    rank: 'R1' as RankId,
    voice: 'steward',
    greeting: [{ voice: 'narrator', text }],
    topics: [],
    decision: {
      prompt: 'How?',
      options: [{ id: 'o1', label: 'l', say: 'my line', react }],
    },
    motivates: [],
  });
  const bundle: StoryTakeBundle = {
    id: 'reader-bundle',
    title: 'Reader bundle',
    rationale: 'canon reads truest',
    takes: [
      {
        id: 'b',
        label: 'Colder',
        brief: 'withholds',
        // greeting differs from canon; the react is a SHARED line (dim test target below
        // pins the mechanism on a fixture-local pair, not on live-canon text).
        rungBeats: { R1: scene('alt-b greeting', 'the shared react') },
      },
    ],
  };

  afterEach(() => {
    document.querySelectorAll('.modal-scrim').forEach((n) => n.remove());
  });

  it('renders canon (live registry) and the take side by side', () => {
    const scrim = openStoryReader(bundle);
    const text = scrim.textContent ?? '';
    expect(text).toContain('Reader bundle');
    expect(text).toContain('canon · the pick');
    expect(text).toContain('b · Colder');
    expect(text).toContain('alt-b greeting');
    expect(text).toContain('rung:R1');
    // canon text comes from the LIVE registry — assert via the source of truth, not a copy.
    const canonGreeting = RUNG_BEATS.R1!.greeting[0]!.text;
    expect(text).toContain(canonGreeting.slice(0, 40));
  });

  it('renders a generalized scene-def bundle (the real hd30-nengu — was blank)', () => {
    const nengu = STORY_TAKE_BUNDLES.find((b) => b.id === 'hd30-nengu');
    expect(nengu, 'hd30-nengu bundle present').toBeDefined();
    const scrim = openStoryReader(nengu!);
    const text = scrim.textContent ?? '';
    // the scene unit must enumerate + render — this whole page was empty before the fix.
    expect(text).toContain('scene:nengu-autumn-frame');
    expect(text).not.toContain('scene:nengu-autumn-frame (reader-only)'); // it's LIVE, not reader-only
    // canon reads the LIVE SCENES registry; the take-a alt renders its own body.
    const takeA = nengu!.takes.find((t) => t.id === 'a')!;
    const altGreeting = takeA.scenes!['nengu-autumn-frame']!.greeting[0]!.text;
    expect(text).toContain(altGreeting.slice(0, 40));
  });

  it('dims a take line that is byte-identical to canon (FB-124)', () => {
    // Build a bundle whose take shares ONE line verbatim with the canon R1 beat.
    const sharedText = RUNG_BEATS.R1!.greeting[0]!.text;
    const sharing: StoryTakeBundle = {
      ...bundle,
      takes: [
        {
          id: 'b',
          label: 'Colder',
          brief: 'withholds',
          rungBeats: { R1: scene(sharedText, 'a fresh react') },
        },
      ],
    };
    const scrim = openStoryReader(sharing);
    const dimmed = [...scrim.querySelectorAll('.log-line')].filter(
      (n) => (n as HTMLElement).style.opacity === '0.45',
    );
    expect(dimmed.length).toBeGreaterThan(0);
    expect(dimmed.some((n) => (n.textContent ?? '').includes(sharedText.slice(0, 30)))).toBe(true);
    // a line unique to the take stays undimmed.
    const fresh = [...scrim.querySelectorAll('.log-line')].find((n) =>
      (n.textContent ?? '').includes('a fresh react'),
    ) as HTMLElement;
    expect(fresh.style.opacity).not.toBe('0.45');
  });

  it('Escape dismisses the reader', () => {
    const scrim = openStoryReader(bundle);
    expect(document.body.contains(scrim)).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.body.contains(scrim)).toBe(false);
  });
});

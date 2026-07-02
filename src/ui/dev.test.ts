// @vitest-environment jsdom
//
// Step 1 (v0.3.1, D-075): the variant-toggle infra. The renderer reads a DEV-only
// `variant: Record<surface,id>` and renders the chosen variant of a diverged surface; nothing
// in src/core branches on it. These RED-able tests prove the routing — a non-default selection
// swaps the House-Influence grade visual, and the default (= prod, where `dev` is undefined)
// renders A. (RED-able: if the seam stopped honouring the selection, or always rendered A, the
// B/C asserts flip red; if it always delegated, the prod-default assert flips red.)
import { describe, it, expect, beforeEach } from 'vitest';
import { mount, type AppHooks } from './render';
import { createDevApi, mountDevPanel, type DevQa } from './dev';
import { createInitialState, setFlag, type GameState, type RankId } from '../core';

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
  };
}

/** A Phase-2 state with the live House-Influence pillar — phaseOf===2 needs R7 + t0-capstone
 *  (ranks.ts), and the panel shows on the Work tab once `panel-house-influence` is unlocked. */
function livingInfluenceState(value = 300): GameState {
  const base = createInitialState(1);
  return {
    ...base,
    rung: 'R7',
    flags: { ...base.flags, awake: true, 't0-capstone': true, 'rank-r7': true },
    unlocked: [...base.unlocked, 'readout-rice', 'panel-house-influence'],
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
  // D-075 zero-flag-debt — the workspace layout+framing pick is LOCKED (byōbu + soft cards), so the
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

  it('renders default A (continuous bar) when no DEV harness is present (= the prod path)', () => {
    const render = mount(root, () => {}, noopHooks()); // dev undefined → prod path
    render(livingInfluenceState(), null);
    expect(root.querySelector('.influence-bar')).not.toBeNull();
    expect(root.querySelector('.influence-seg')).toBeNull();
    expect(root.querySelector('.influence-marks')).toBeNull();
  });

  it('routes to variant B (segmented bands) when selected', () => {
    const dev = createDevApi();
    dev.setVariant('influence', 'influence-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(livingInfluenceState(), null);
    expect(root.querySelector('.influence-seg')).not.toBeNull();
    expect(root.querySelector('.influence-bar')).toBeNull();
  });

  it('routes to variant C (standing marks) when selected', () => {
    const dev = createDevApi();
    dev.setVariant('influence', 'influence-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(livingInfluenceState(), null);
    expect(root.querySelector('.influence-marks')).not.toBeNull();
    expect(root.querySelector('.influence-bar')).toBeNull();
  });

  it('falls back to A when the DEV harness selects the default explicitly', () => {
    const dev = createDevApi(); // default = influence-a
    const render = mount(root, () => {}, noopHooks(), dev);
    render(livingInfluenceState(), null);
    expect(root.querySelector('.influence-bar')).not.toBeNull();
    expect(root.querySelector('.influence-seg')).toBeNull();
  });
});

describe('renderer variant routing — Estate map (D-075, Step 5e)', () => {
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

  /** Awake, standing at the forecourt with the near nodes revealed → the Estate 地図 tab is available. */
  function walkableState(): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      location: 'gate-forecourt',
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'room-gate-forecourt', 'room-home-paddies', 'room-woodlot-edge'],
    };
  }
  function openMapTab(): void {
    const tab = [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')].find((b) =>
      (b.textContent ?? '').includes('地図'),
    );
    tab?.click();
  }

  it('renders default A (the you-are-here + paths list) with no DEV harness (= prod)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(walkableState(), null);
    openMapTab();
    expect(root.querySelector('.map-here')).not.toBeNull(); // the default you-are-here card
    expect(root.textContent).toContain('Paths lead to');
  });

  it('routes to map-b (絵地図 schematic) when selected — a spatial board, not the paths card', () => {
    const dev = createDevApi();
    dev.setVariant('map', 'map-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(walkableState(), null);
    openMapTab();
    expect(root.querySelector('.map-here')).toBeNull(); // the default is replaced
    expect(root.textContent).toContain('You are here'); // the schematic lit the current node
    expect(root.textContent).toContain('Walk here'); // a live neighbour
  });

  it('routes to map-c (道中記 ledger) when selected — informed routes with a set-out verb', () => {
    const dev = createDevApi();
    dev.setVariant('map', 'map-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(walkableState(), null);
    openMapTab();
    expect(root.querySelector('.map-here')).toBeNull();
    expect(root.textContent).toContain('You stand at'); // the ledger banner
    expect(root.textContent).toContain('Set out'); // a route's depart verb
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
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'tab-combat', 'panel-bestiary'],
      },
      'mob-monkey',
    );
  }
  function openCombat(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('Combat'))
      ?.click();
  }

  it('renders default A (field-guide cards) with no DEV harness (= prod)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(bestiaryState(), null);
    openCombat();
    expect(root.querySelector('.bestiary-card')).not.toBeNull();
    expect(root.textContent).not.toContain('危険帳'); // not the danger ledger
    expect(root.textContent).not.toContain('The beasts of the estate'); // not the scroll
  });

  it('routes to bestiary-b (danger ledger) when selected — a ranked ink table, not the cards', () => {
    const dev = createDevApi();
    dev.setVariant('bestiary', 'bestiary-b');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(bestiaryState(), null);
    openCombat();
    expect(root.querySelector('.bestiary-card')).toBeNull(); // the default is replaced
    expect(root.textContent).toContain('Danger ledger');
    expect(root.textContent).toContain('危険帳');
  });

  it('routes to bestiary-c (図鑑 scroll) when selected — diegetic entries, not the cards', () => {
    const dev = createDevApi();
    dev.setVariant('bestiary', 'bestiary-c');
    const render = mount(root, () => {}, noopHooks(), dev);
    render(bestiaryState(), null);
    openCombat();
    expect(root.querySelector('.bestiary-card')).toBeNull();
    expect(root.textContent).toContain('The beasts of the estate');
  });
});

// F49 — the DEV Speed row: 1·2·4·8·16, active multiplier highlighted (gold #b08d4f bg), default 1×.
describe('DEV panel — Speed row (F49)', () => {
  function stubQa(): DevQa & { last: number | null } {
    const q = {
      last: null as number | null,
      speed(m: number) {
        q.last = m;
        return m;
      },
      jumpToPhase2: () => 0,
      jumpToAscension: () => {},
      faceWolf: () => {},
      toRung: () => 0,
      auto: () => {},
      autoCombat: () => {},
      newGame: () => {},
      hasBackup: async () => false,
      restoreBackup: async () => false,
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
    mountDevPanel(host, { qa: stubQa(), dev: createDevApi(), rerender: () => {} });
    const labels = speedButtons(host).map((b) => b.textContent);
    expect(labels).toEqual(['1×', '2×', '4×', '8×', '16×']);
    host.remove();
  });

  it('highlights 1× by default and no other', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, { qa: stubQa(), dev: createDevApi(), rerender: () => {} });
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
    mountDevPanel(host, { qa, dev: createDevApi(), rerender: () => {} });
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

// F95 — the New-game footer button is HALF WIDTH + left-anchored so an accidental double-click on
// the compact dev menu can't land on it (the right half of the row is deliberately empty).
describe('DEV panel — New-game footer safety (F95)', () => {
  function stubQa(over: Partial<DevQa> = {}): DevQa {
    return {
      speed: (m: number) => m,
      jumpToPhase2: () => 0,
      jumpToAscension: () => {},
      faceWolf: () => {},
      toRung: () => 0,
      auto: () => {},
      autoCombat: () => {},
      newGame: () => {},
      hasBackup: async () => false,
      restoreBackup: async () => false,
      selectors: { rung: () => 'R0' as RankId },
      ...over,
    };
  }
  const btnByText = (host: HTMLElement, needle: string): HTMLButtonElement =>
    [...host.querySelectorAll('button')].find((b) =>
      (b.textContent ?? '').includes(needle),
    ) as HTMLButtonElement;

  it('renders the New-game button half-width and left-anchored (not full width)', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, { qa: stubQa(), dev: createDevApi(), rerender: () => {} });
    const btn = btnByText(host, 'New game');
    expect(btn).toBeTruthy();
    // half width + pinned left (was flex:1 / full width) so a stray double-click misses it.
    expect(btn.style.width).toBe('50%');
    expect(btn.style.alignSelf).toBe('flex-start');
    host.remove();
  });

  it('renders "goto last backup" ABOVE New game, disabled until a backup exists', () => {
    const host = document.createElement('div');
    document.body.append(host);
    mountDevPanel(host, { qa: stubQa(), dev: createDevApi(), rerender: () => {} });
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
    });
    await Promise.resolve(); // let the async hasBackup probe settle
    const restore = btnByText(host, 'last backup');
    expect(restore.disabled).toBe(false);
    restore.click();
    expect(restored).toBe(1);
    host.remove();
  });
});

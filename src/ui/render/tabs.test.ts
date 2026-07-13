// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '../render';
import { createInitialState, type GameState, factsForSurfaces } from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { noopHooks } from './test-utils';

describe('D-119/ADR-177 — tabs reveal one beat at a time (Schedule A)', () => {
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
  function tabLabels(): string[] {
    return [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')].map(
      (b) => b.textContent ?? '',
    );
  }
  function at(surfaces: string[]): void {
    const base = createInitialState(1);
    const render = mount(root, () => {}, noopHooks());
    // ADR-179 — stamp the FACTS that entitle each surface (rank-rN / event flags);
    // visibility derives, so a rung's whole grant-list travels together.
    render(
      { ...base, flags: { ...base.flags, awake: true, ...factsForSurfaces(...surfaces) } },
      null,
    );
  }

  it('R1 is Map ALONE — Estate, Works, and Inventory all wait (no triple-reveal)', () => {
    // ADR-184 — R1's one zone is the PADDY now (the gate earns its own VN at R2). The Map must
    // still light here: it is the only travel affordance in the game, and R1→R2 is farm work in a
    // paddy you have to walk to. Keying the Map to `room-gate` (as it was) stranded the day-hand
    // in the forecourt — a soft-lock no engine test could see, because `move_to` needs no tab.
    at(['room-paddies']);
    const labels = tabLabels();
    expect(labels.some((l) => l.includes('地図'))).toBe(true); // Map
    // RED against the old schedule: Estate used to light at R1 (ADR-177 moved it to R6).
    expect(labels.some((l) => l.includes('家') && !l.includes('武'))).toBe(false);
    expect(labels.some((l) => l.includes('普請'))).toBe(false);
    expect(labels.some((l) => l.includes('Inventory'))).toBe(false);
    expect(labels.some((l) => l.includes('Quests'))).toBe(false);
  });

  it('Works 普請 lights on the works-intro NAMING (cause-gated), not on a rung', () => {
    const base = createInitialState(1);
    const render = mount(root, () => {}, noopHooks());
    render(
      {
        ...base,
        flags: { ...base.flags, awake: true, ...factsForSurfaces('room-gate', 'panel-estate') },
      },
      null,
    );
    expect(tabLabels().some((l) => l.includes('普請'))).toBe(true);
  });

  it('R3 (combat live) does NOT bring Inventory — it waits for its own R4 beat', () => {
    // ADR-179 — panel-home DERIVES from tab-inventory (its facts are rank-r4), so it can
    // no longer be granted at R3 without dragging the Inventory tab along: the R3 state
    // simply doesn't have the home yet (they travel together at R4).
    at(['room-gate', 'panel-estate', 'tab-combat']);
    expect(tabLabels().some((l) => l.includes('Inventory'))).toBe(false);
    expect(tabLabels().some((l) => l.includes('Quests'))).toBe(false);
  });

  it('R4 (tab-inventory granted) is where the Inventory tab reveals — its own beat', () => {
    // ADR-179 — panel-home rides tab-inventory's rank-r4 fact; no separate grant needed.
    at(['room-gate', 'panel-estate', 'tab-combat', 'tab-inventory']);
    expect(tabLabels().some((l) => l.includes('Inventory'))).toBe(true);
  });

  it('R5 (tab-quests granted) is where the Quests tab reveals — its own beat', () => {
    at(['room-gate', 'panel-estate', 'tab-combat', 'tab-inventory', 'tab-quests']);
    expect(tabLabels().some((l) => l.includes('Quests'))).toBe(true);
  });

  it('R6 (tab-estate granted) is where Estate 家 finally reveals — the capstone tab', () => {
    at(['room-gate', 'tab-estate']);
    expect(tabLabels().some((l) => l.includes('家') && !l.includes('武'))).toBe(true);
  });
});

// ── A7 — the staggered combat reveal + the Bestiary panel (default variant A) ────────────────
// ── FB-358 (inbox drain 2026-07-10) — a state swap that COLLAPSES the tab set (the DEV
//    "NG (post open)" fixture load: a deep-R1 run → a fresh R0 state) must not leave the
//    old tab's panel on screen. renderNav's <2-tabs early return used to skip the
//    activeTab-not-in-list fallback, so activeTab stayed 'map' and the map pane kept
//    rendering over an R0 state (no map unlock). RED against that order.
describe('FB-358 — a tab-set collapse resets activeTab to work', () => {
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

  it('loading an R0 state while the Map tab is active falls back to the Work panel', () => {
    const base = createInitialState(1);
    const rich: GameState = {
      ...base,
      flags: {
        ...base.flags,
        awake: true,
        ...factsForSurfaces('room-gate', 'panel-estate', 'panel-home'),
      },
    };
    const render = mount(root, () => {}, noopHooks());
    render(rich, null);
    const mapTab = [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')].find((b) =>
      (b.textContent ?? '').includes('地図'),
    );
    expect(mapTab).toBeDefined();
    mapTab!.click(); // setTab('map') re-renders off lastState
    const mapPane = root.querySelector<HTMLElement>('.map-pane')!;
    expect(mapPane.hidden).toBe(false);
    // the fixture-load swap: a fresh awake R0 state — no map content, tab set collapses
    const r0: GameState = { ...createInitialState(1), flags: { awake: true } };
    render(r0, null);
    expect(mapPane.hidden).toBe(true); // the stale map pane must drop…
    const doPane = root.querySelector<HTMLElement>('[data-panel=do]')!;
    expect(doPane.hidden).toBe(false); // …and the Work panel take its place
  });
});

// ── FB-359/FB-360 (inbox drain 2026-07-10) — New game DURING an open VN scene: the
//    pre-awake render branch early-returns, and it used to skip teardownIntroScene(),
//    leaving the dead .vn-scene overlay (z-40) mounted over the cold open forever —
//    its buttons dispatch intents the pre-awake reducer refuses ("can't click
//    continue", "can't even press new game"). RED against the old branch.

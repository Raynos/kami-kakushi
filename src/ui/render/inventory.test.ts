// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '../render';
import {
  createInitialState,
  getBelonging,
  getWeapon,
  type GameState,
  type Intent,
  factsForSurfaces,
} from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { noopHooks } from './test-utils';

describe('render — the HOME + belongings (Inventory tab, D-111 / F89)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = ((q: string) =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList) as unknown as typeof window.matchMedia;
    root = document.createElement('div');
    document.body.append(root);
  });

  // the home GRANTED (panel-home) + the estate economy open, and combat live so the Inventory tab is
  // REVEALED. ADR-177 Schedule A — panel-home now gates on tab-inventory, the same R4
  // surface as its tab, so the home is announced exactly when its tab appears.
  function homeState(extra?: Partial<GameState>): GameState {
    const s = createInitialState(1);
    // ADR-179 — the facts: rank-r1 (gate/paddies/ladder), works-named-u1 (panel-estate),
    // rank-r4 (tab-inventory, which panel-home keys to — ADR-177: the home appears exactly
    // when its tab does); readout-rice derives from awake + intro-not-active.
    return {
      ...s,
      flags: {
        ...s.flags,
        awake: true,
        raked: true,
        ...factsForSurfaces(
          'room-gate',
          'room-paddies',
          'panel-rung-ladder',
          'panel-estate',
          'panel-home',
          'tab-inventory',
        ),
      },
      ...extra,
    };
  }

  function openInventory(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('Inventory'))
      ?.click();
  }

  it('reveals the home + the promised bowl on the Inventory tab, with buyable comfort furniture', () => {
    const render = mount(root, () => {}, noopHooks());
    render(homeState(), null);
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    expect(pane).not.toBeNull();
    expect(pane.hidden).toBe(false);
    // the bowl + the mat exist — the promised keepsakes, made real.
    const names = [...pane.querySelectorAll('.belonging-name')].map((n) => n.textContent);
    expect(names).toContain('A rice bowl');
    expect(names).toContain('A straw sleeping-mat');
    // …and there's at least one comfort piece to acquire (a coin buy button).
    expect(pane.querySelector('.belonging-buy button')).not.toBeNull();
    // the comfort summary reads a bare corner until you furnish it.
    expect(pane.querySelector('.belongings-comfort-summary')?.textContent).toMatch(/bare corner/i);
  });

  it('shows a bought piece and its comfort bonus in effect', () => {
    const render = mount(root, () => {}, noopHooks());
    render(homeState({ belongings: ['bedding'] }), null);
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    const names = [...pane.querySelectorAll('.belonging-name')].map((n) => n.textContent);
    expect(names).toContain('A futon'); // the owned futon shows in "what is yours"
    // the comfort tally reflects the bedding's rest bonus (source of truth), not a bare corner.
    const amt = getBelonging('bedding').comfort?.amount ?? 0;
    expect(amt).toBeGreaterThan(0);
    expect(pane.querySelector('.belongings-comfort-summary')?.textContent).toContain(
      `rest +${amt}`,
    );
  });

  it('mounts the WIELDED weapon on the wall at R5 (status-mirror), reading the actual weapon (D-122)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = homeState();
    // pre-R5 (no wall-weapon flag) → the status-mirror is hidden.
    render(s, null);
    openInventory();
    expect(root.querySelector<HTMLElement>('.belongings-status-mirror')!.hidden).toBe(true);
    // at R5 with the token + a SPECIFIC weapon wielded → the mount names THAT weapon (not a generic
    // sword), read live from equippedWeapon. RED against a hardcoded mount / an ignored weapon.
    const axe = getWeapon('wood_axe');
    render({ ...s, flags: { ...s.flags, 'wall-weapon': true }, equippedWeapon: axe.id }, null);
    openInventory();
    const mirror = root.querySelector<HTMLElement>('.belongings-status-mirror')!;
    expect(mirror.hidden).toBe(false);
    expect(mirror.textContent!.toLowerCase()).toContain(axe.label.toLowerCase());
    expect(mirror.textContent!.toLowerCase()).not.toContain('sword');
  });

  it('hides the belongings pane before the home is granted (reveal-gated, no ghost box F72)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = createInitialState(1);
    render({ ...s, flags: { ...s.flags, awake: true, raked: true } }, null); // awake but pre-R1
    const pane = root.querySelector<HTMLElement>('.belongings-pane');
    expect(pane === null || pane.hidden).toBe(true);
  });

  // ADR-075 — the prod default (variant A, no DEV harness) is the shipped functional list; a buy button
  // drives the REAL buy_belonging intent (RED-able: if the button stopped dispatching, or the DEV
  // variant leaked into prod and replaced the list, this flips red).
  it('the prod default buy button dispatches buy_belonging (no DEV variant leaks in)', () => {
    const seen: Intent[] = [];
    const render = mount(root, (i) => seen.push(i), noopHooks());
    render(homeState({ resources: { coin: 500 } as GameState['resources'] }), null);
    openInventory();
    const pane = root.querySelector<HTMLElement>('.belongings-pane')!;
    // the shipped list — NOT a DEV cutaway / ledger frame.
    expect(pane.querySelector('.home-room')).toBeNull();
    expect(pane.querySelector('.home-ledger')).toBeNull();
    const btn = pane.querySelector<HTMLButtonElement>('.belonging-buy button')!;
    expect(btn).not.toBeNull();
    btn.click();
    expect(seen.some((i) => i.type === 'buy_belonging')).toBe(true);
  });
});

// ── FB-224 — the cold-open rake teach cooldown: while Genemon's three raked-gated teach
//    lines land one-per-rake, the rake press cools down long enough for the arriving line
//    to finish typing. The bound derives from the SAME registry + cadence the writer uses
//    (ADR-086), so a longer authored line or an id rename goes RED here.

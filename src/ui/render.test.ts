// @vitest-environment jsdom
// @slow — 103-test jsdom render suite (~5s); runs at push/CI, not the per-commit
// vitest lane (verify budget, ADR-072/ADR-176). See src/scripts/vitest-verify.ts.
//
// The feel-pass (Commit 8) render assertions: the pure ×N log formatter, the
// unknown-foe fog gating, and the settings-modal a11y (textarea labels + Tab
// focus-trap). DOM tests mount the real renderer and drive it like the app does.
import {
  nodeSeasonalBlurb,
  satietyMax,
  hungerMax,
  restQuality,
  activityForecast,
  getActivity,
} from '../core';
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from './render';
import {
  createInitialState,
  foesHere,
  setFlag,
  reduce,
  getNode,
  balance,
  formatKMB,
  gradeOf,
  type GameState,
  type Intent,
  type LogEntry,
  factsForSurfaces,
} from '../core';
import { __setStoryOverlay } from '../core/content/story-overlay';

import { noopHooks, awakeCombatState } from './render/test-utils';

describe('render — settings a11y + unknown-foe fog', () => {
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

  // IA reorg (ADR-112) — the House-Influence koku standing lives on the Estate tab now; click its chip.
  function openTab(marker: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes(marker))
      ?.click();
  }

  it('save textareas carry id + name + aria-label', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awakeCombatState(), null);

    const exp = root.querySelector<HTMLTextAreaElement>('#save-export')!;
    const imp = root.querySelector<HTMLTextAreaElement>('#save-import')!;
    expect(exp).not.toBeNull();
    expect(exp.name).toBe('save-export');
    expect(exp.getAttribute('aria-label')).toBe('Exported save code');
    expect(imp.name).toBe('save-import');
    expect(imp.getAttribute('aria-label')).toBe('Paste a save code to import');
  });

  it('traps Tab inside the open settings modal (last → first, first → last)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awakeCombatState(), null);

    root.querySelector<HTMLButtonElement>('.settings-btn')!.click(); // open()
    const card = root.querySelector<HTMLElement>('.modal-card')!;
    const focusables = card.querySelectorAll<HTMLElement>(
      'button, textarea, input, [href], [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    expect(focusables.length).toBeGreaterThan(1);

    last.focus();
    card.dispatchEvent(
      new window.KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(document.activeElement).toBe(first);

    first.focus();
    card.dispatchEvent(
      new window.KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(document.activeElement).toBe(last);
  });

  it('hides the win-rate % for an unseen foe, then reveals it once encountered', () => {
    const render = mount(root, () => {}, noopHooks());
    const state = awakeCombatState();
    render(state, null);
    // switch to the Combat tab via its nav button
    const combatTab = [
      ...root.querySelectorAll<HTMLButtonElement>('.nav-tab'),
    ].find((b) => (b.textContent ?? '').includes('Combat'))!;
    expect(combatTab).toBeTruthy();
    combatTab.click();

    const rows = [...root.querySelectorAll<HTMLElement>('.foe-row')];
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      const wr = r.querySelector('.win-rate')!;
      expect(wr.querySelector('.pip.unknown')).not.toBeNull();
      expect(wr.textContent).toContain('Unknown');
      expect(wr.textContent).not.toContain('%');
    }

    // mark the first grindable foe ON THIS NODE as encountered → its row now shows a real %.
    // (foe rows are node-scoped via foesHere, so use the node's first foe, not the global curve's.)
    const firstMob = foesHere(state)[0]!.mob.id;
    const seenState = setFlag(state, `mob-${firstMob}`);
    render(seenState, state);

    const seenRow = root.querySelector<HTMLElement>('.foe-row')!;
    const seenWr = seenRow.querySelector('.win-rate')!;
    expect(seenWr.querySelector('.pip.unknown')).toBeNull();
    expect(seenWr.textContent).toContain('%');
  });

  it('after ascension the House Influence panel RESOLVES — not the stale "reach Excellent" prompt (5d/F2)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = createInitialState(1);
    const excellent = balance.ESTATE_BANDS.excellent;
    const ascended: GameState = {
      ...s,
      rung: 'R7',
      tier: 1,
      // ADR-177 Schedule A — tab-estate (R6) lights the Estate 家 tab, the koku standing's home.
      // ADR-179 — the surfaces derive from their rungs' latched facts (r1 + r6).
      flags: {
        ...s.flags,
        awake: true,
        'rank-r7': true,
        't0-capstone': true,
        'ascended-t0': true,
        ...factsForSurfaces(
          'panel-rung-ladder',
          'tab-estate',
          'panel-house-influence',
        ),
      },
      influence: {
        estate: { value: excellent, highWater: excellent, judged: 0 },
      },
      character: { ...s.character, attributePoints: 5 },
    };
    render(ascended, null);
    openTab('家'); // the koku standing is on the Estate 家 tab (IA reorg ADR-112)

    const panel = root.querySelector<HTMLElement>('.influence-panel')!;
    expect(panel).toBeTruthy();
    // the AFTER of the payoff: a resolved next-state, the boon prompt — and NOT the 480/480 bug.
    expect(panel.textContent).toContain('man of the house');
    expect(panel.textContent).toContain('Risen');
    expect(panel.textContent).toContain('5 points'); // the lord's boon, waiting to be spent
    expect(panel.textContent).not.toContain(
      'Reach Excellent standing to ascend',
    );
  });

  // ── ADR-107 Phase 4 — the House-Influence pillar re-skinned as the koku STANDING ──
  // A Phase-2 (post-R7 capstone), pre-ascension House at a chosen pillar value. Fixtures derive
  // from ESTATE_BANDS / gradeOf / DAIMYO_KOKU (the pillar source of truth), never copied magic numbers.
  function liveHouse(value: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      rung: 'R7',
      tier: 0, // pre-ascension: still climbing toward the EXCELLENT gate
      // tab-estate lights the Estate tab (the koku standing's IA home); panel-house-influence
      // makes the standing live. Both are unlocked by R7 in real play (ADR-179 — derived
      // from the latched rank-r1/rank-r6 facts, never a stored list).
      flags: {
        ...s.flags,
        awake: true,
        't0-capstone': true, // phaseOf === 2 → the pillar is live
        ...factsForSurfaces(
          'panel-rung-ladder',
          'tab-estate',
          'panel-house-influence',
        ),
      },
      influence: { estate: { value, highWater: value, judged: 0 } },
    };
  }

  it('D-107 Ph4 — the panel reads "The House stands at N koku", the koku tracks the pillar value', () => {
    const render = mount(root, () => {}, noopHooks());
    // a non-band-boundary value in the GREAT band (derive the band, don't hard-code a grade)
    const value = balance.ESTATE_BANDS.great + 12;
    render(liveHouse(value), null);
    openTab('家'); // the koku standing is on the Estate 家 tab

    const panel = root.querySelector<HTMLElement>('.influence-panel')!;
    expect(panel.textContent).toContain('The House stands at');
    expect(panel.textContent).toContain('koku');
    // the koku figure IS the pillar value, rendered as a rank number via formatKMB (never mon).
    const fig = panel.querySelector<HTMLElement>('.koku-standing')!;
    expect(fig.textContent).toBe(formatKMB(value));
    // a mutation-catch: were the render to hard-code or mis-read the value, this would go RED.
    expect(fig.textContent).not.toBe(formatKMB(value + 1));
  });

  it('D-107 Ph4 — the grade sub-label matches gradeOf(value) from the pillar source', () => {
    for (const value of [
      balance.ESTATE_BANDS.good + 5, // GOOD
      balance.ESTATE_BANDS.great + 5, // GREAT
      balance.ESTATE_BANDS.excellent + 5, // EXCELLENT
    ]) {
      document.body.innerHTML = '';
      root = document.createElement('div');
      document.body.append(root);
      const render = mount(root, () => {}, noopHooks());
      render(liveHouse(value), null);
      openTab('家');
      const gradeEl = root.querySelector<HTMLElement>('.influence-grade')!;
      // the grade class is derived from the same gradeOf the ascension gate reads (AC-6 — one source).
      expect(gradeEl.className).toContain(
        `grade-${gradeOf(value).toLowerCase()}`,
      );
    }
  });

  it('D-107 Ph4 — the standing names the daimyō horizon at 10,000 koku (D-109)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(liveHouse(balance.ESTATE_BANDS.great), null);
    openTab('家');
    const panel = root.querySelector<HTMLElement>('.influence-panel')!;
    // the mythic ceiling, derived from the single-source DAIMYO_KOKU (not a hard-typed "10,000").
    expect(panel.textContent).toContain(
      balance.DAIMYO_KOKU.toLocaleString('en-US'),
    );
    expect(panel.textContent).toContain('daimyō');
  });

  it('D-107 Ph4 — the pre-ascension gate reads "must stand at N koku" (koku-consistent copy)', () => {
    const render = mount(root, () => {}, noopHooks());
    const value = balance.ESTATE_BANDS.good + 5; // GOOD → below the EXCELLENT gate, not ascendable
    render(liveHouse(value), null);
    openTab('家');
    const panel = root.querySelector<HTMLElement>('.influence-panel')!;
    expect(panel.textContent).toContain('must stand at');
    expect(panel.textContent).toContain(
      `${formatKMB(balance.ESTATE_BANDS.excellent)} koku`,
    );
    // the old grade-noun copy is gone — the gate speaks in koku now.
    expect(panel.textContent).not.toContain(
      'Reach Excellent standing to ascend',
    );
  });
});

describe('surface buttons dispatch the right Intent (battery #11 — DOM interaction)', () => {
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

  function spyMount(): { seen: Intent[]; render: ReturnType<typeof mount> } {
    const seen: Intent[] = [];
    const render = mount(root, (i) => seen.push(i), noopHooks());
    return { seen, render };
  }
  function openTab(marker: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes(marker))
      ?.click();
  }
  function clickText(substr: string): boolean {
    const btn = [...root.querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => (b.textContent ?? '').includes(substr),
    );
    btn?.click();
    return Boolean(btn);
  }

  it('a labour button dispatches do_activity for THIS node (spatial)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'paddies',
        flags: {
          ...base.flags,
          awake: true,
          ...factsForSurfaces('verb-farm', 'room-paddies'),
        },
      },
      null,
    );
    expect(clickText('Work the home paddy')).toBe(true);
    expect(seen).toContainEqual({
      type: 'do_activity',
      activityId: 'farm_paddy',
    });
  });

  it('FB-346 — every action button carries a one-line cost/effect title (no bare hovers)', () => {
    const { render } = spyMount();
    const base = createInitialState(1);
    const s: GameState = {
      ...base,
      location: 'paddies',
      // 'raked' is what puts Rest on offer (availableActions)
      flags: {
        ...base.flags,
        awake: true,
        raked: true,
        ...factsForSurfaces('verb-farm', 'room-paddies'),
      },
    };
    render(s, null);
    // the labour button's title derives from the SAME forecast the reducer pays (AC-6)
    const farm = [...root.querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => (b.textContent ?? '').includes('Work the home paddy'),
    )!;
    const f = activityForecast(s, getActivity('farm_paddy'));
    expect(farm.title).toContain(`+${f.xp} `);
    expect(farm.title).toMatch(/−\d+ body$/);
    // Rest reads its granted number too (the reducer's constant, not a copy)
    const rest = [...root.querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => (b.textContent ?? '').trim() === 'Rest a moment',
    )!;
    expect(rest.title).toContain('body');
    expect(rest.title).toMatch(/^\+\d+/);
  });

  it('a map node dispatches move_to (the survey-plan sheet — click the seal to walk)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        // stand at the forecourt (the R0 hub) — the paddy is one of its walkable neighbours.
        location: 'forecourt',
        flags: {
          ...base.flags,
          awake: true,
          ...factsForSurfaces('room-gate', 'room-paddies'),
        },
      },
      null,
    );
    openTab('地図');
    // the sheet's nodes are SVG travel controls (role=button), not <button>s — click via data-node.
    const node = root.querySelector<HTMLElement>(
      '.map-pane [data-node="paddies"]:not([data-locked])',
    );
    expect(node).not.toBeNull();
    node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(seen.some((i) => i.type === 'move_to')).toBe(true);
  });

  it('the storehouse Store button dispatches deposit (Inventory tab, only at the kura)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'kura',
        // ADR-177 — the Inventory tab reveals at R4 (ADR-179: rank-r4 + works-named-u1 facts)
        flags: {
          ...base.flags,
          awake: true,
          ...factsForSurfaces('panel-estate', 'tab-inventory'),
        },
        resources: { ...base.resources, coin: 50 },
      },
      null,
    );
    openTab('蔵'); // the kura bank is on the Inventory 蔵 tab (FB-108 / IA reorg ADR-112, revealed R3 ADR-119)
    expect(clickText('Store all coin')).toBe(true);
    expect(seen).toContainEqual({ type: 'deposit', resource: 'coin' });
  });

  it('the market Sell-rice button dispatches sell_rice (D-107 Phase 2 — the coin faucet)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        // the gate must be open so the Map tab (the pedlar's home) is reachable; a MARKET DAY
        // (dayOfWeek 2) so Yohei stands his stall; and kura rice to sell (rice is kura-only now).
        location: 'gate',
        clock: { ...base.clock, day: 2 },
        flags: {
          ...base.flags,
          awake: true,
          ...factsForSurfaces('panel-estate', 'room-gate'),
        },
        banked: { ...base.banked, rice: 30 },
      },
      null,
    );
    // FB-332 — the pedlar's who's-here row lives on the Zone tab (the default tab) now.
    // ADR-114 — his wares open only by TALKING to him (Yohei), never inline.
    expect(clickText('Speak with Yohei')).toBe(true);
    // ADR-163 — rice sells from the KURA; the button reads "Sell kura rice (N shō → …)".
    expect(clickText('Sell kura rice')).toBe(true);
    expect(seen).toContainEqual({ type: 'sell_rice' });
  });

  it('the Eat-plain-rice button dispatches eat_rice (D-107 Phase 2 — the rice food path)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        flags: {
          ...base.flags,
          awake: true,
          ...factsForSurfaces('panel-estate', 'verb-eat-rice'),
        },
        // ADR-163 — the meal is drawn from the KURA (shō), never a carried pile.
        banked: { ...base.banked, rice: 30 },
      },
      null,
    );
    // FB-343/FB-369 — the food verbs live on the Character 己 tab's Body card now.
    expect(clickText('Character')).toBe(true);
    expect(clickText('Eat plain rice')).toBe(true);
    expect(seen).toContainEqual({ type: 'eat_rice' });
  });

  it('FB-343/FB-369 — the food verbs live ONLY on the Character Body card, never the zone column', () => {
    const { render } = spyMount();
    const base = createInitialState(1);
    const s: GameState = {
      ...base,
      flags: {
        ...base.flags,
        awake: true,
        ...factsForSurfaces('verb-cook', 'verb-eat-rice'),
      },
      banked: { ...base.banked, rice: 30 },
      resources: { ...base.resources, sansai: 20 },
    };
    render(s, null);
    // the Work tab (default) must NOT carry them — the reported regression.
    const visibleButtons = (): string[] =>
      [...root.querySelectorAll<HTMLButtonElement>('button')]
        .filter((b) => !b.closest('[hidden]') && !b.hidden)
        .map((b) => b.textContent ?? '');
    expect(visibleButtons().join('|')).not.toMatch(
      /Eat plain rice|Cook a meal/,
    );
    // …and the Character 己 tab's Body card is their one home, vitals beside them (TST4).
    expect(clickText('Character')).toBe(true);
    const shown = visibleButtons().join('|');
    expect(shown).toContain('Eat plain rice');
    expect(shown).toContain('Cook a meal');
    const body = root.querySelector<HTMLElement>('.character-body')!;
    expect(body.hidden).toBe(false);
    expect(body.textContent).toContain('Body 体');
    expect(body.textContent).toContain('Belly 腹');
  });

  it('a foe Fight button dispatches fight for the foe on THIS node', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'field-margins', // the tanuki/badger node (the paddy's edge)
        flags: {
          ...base.flags,
          awake: true,
          'mob-tanuki': true,
          ...factsForSurfaces('tab-combat'),
        },
      },
      null,
    );
    openTab('Combat');
    expect(clickText('Fight')).toBe(true);
    expect(seen.some((i) => i.type === 'fight' && i.mobId === 'tanuki')).toBe(
      true,
    );
  });

  it('F107 (D-112) — navigation lives ONLY on the Map tab; the Work tab has no "Walk on" strip', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'forecourt',
        flags: {
          ...base.flags,
          awake: true,
          ...factsForSurfaces('room-gate', 'room-paddies'),
        },
      },
      null,
    );
    // the default Work tab carries NO travel controls (FB-107 — nav's single home is Map).
    expect(root.querySelector('.actions .walk-on')).toBeNull();
    expect(root.querySelector('.actions [data-node]')).toBeNull();
    // open the Map tab — the survey sheet's nodes live there, and moving from Map still works.
    openTab('地図');
    const node = root.querySelector<HTMLElement>(
      '.map-pane [data-node="paddies"]',
    );
    expect(node).not.toBeNull();
    node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(seen).toContainEqual({ type: 'move_to', to: 'paddies' });
  });

  it('the HP "life" meter is visible once combat matters — with an exact number + a low flag (D-076)', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    const combatReady: GameState = {
      ...base,
      flags: { ...base.flags, awake: true, ...factsForSurfaces('tab-combat') },
    };
    // hurt: HP is invisible-no-more — the number shows AND the bar flags danger.
    render(
      { ...combatReady, character: { ...combatReady.character, hp: 1 } },
      null,
    );
    const health = root.querySelector<HTMLElement>('.vital.health');
    expect(health).not.toBeNull();
    expect(health!.hidden).toBe(false);
    expect(health!.textContent).toMatch(/1\/\d+/); // the exact "1/max" number
    expect(health!.querySelector('.bar')!.classList.contains('low')).toBe(true); // danger flag

    // healed: the bar is no longer flagged low.
    render(
      { ...combatReady, character: { ...combatReady.character, hp: 999 } },
      { ...combatReady, character: { ...combatReady.character, hp: 1 } },
    );
    expect(
      root.querySelector('.vital.health .bar')!.classList.contains('low'),
    ).toBe(false);
  });

  it('FB-335 — the body meter carries an exact number + a hover name (never a mystery strip)', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    const s: GameState = {
      ...base,
      flags: {
        ...base.flags,
        awake: true,
        ...factsForSurfaces('readout-stamina'),
      },
      character: { ...base.character, satiety: 42 },
    };
    render(s, null);
    const body = root.querySelector<HTMLElement>('.vital.stamina')!;
    expect(body.hidden).toBe(false);
    // the exact "current/max" readout, derived from the SAME selector the reducer spends (AC-6)
    expect(body.textContent).toContain(`42/${Math.round(satietyMax(s))}`);
    // the hover title says what the meter IS and what moves it (FB-334 vocabulary: "body")
    expect(body.title).toMatch(/^Body 体/);
    expect(body.title).not.toMatch(/satiety/i);
  });

  it('D-178 — the belly meter reveals WITH body, exact number + hover name, low = degraded rest', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    const s: GameState = {
      ...base,
      flags: {
        ...base.flags,
        awake: true,
        ...factsForSurfaces('readout-stamina'),
      },
      character: { ...base.character, hunger: 33 },
    };
    render(s, null);
    const belly = root.querySelector<HTMLElement>('.vital.belly')!;
    expect(belly.hidden).toBe(false);
    // the FB-335 idiom: the exact "current/max" number, never a mystery strip
    expect(belly.textContent).toContain(`33/${Math.round(hungerMax(s))}`);
    // FB-334's law — the display name, never the internal field name
    expect(belly.title).toMatch(/^Belly 腹/);
    expect(belly.title).not.toMatch(/hunger/i);
    // the low flag fires exactly when the teeth bite (restQuality < 1, AC-6) …
    expect(restQuality(s)).toBeLessThan(1);
    expect(belly.querySelector('.bar')!.classList.contains('low')).toBe(true);
    // … and clears on a fed belly.
    const fed: GameState = {
      ...s,
      character: { ...s.character, hunger: hungerMax(s) },
    };
    render(fed, s);
    expect(belly.querySelector('.bar')!.classList.contains('low')).toBe(false);
  });

  it('the Cook button is NEVER the heal cue — food is satiety-only (ADR-164/ADR-197)', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    const ready: GameState = {
      ...base,
      flags: { ...base.flags, awake: true, ...factsForSurfaces('verb-cook') },
      resources: { ...base.resources, sansai: 20 },
    };
    const cookBtn = (): HTMLButtonElement =>
      [...root.querySelectorAll<HTMLButtonElement>('button')].find((b) =>
        (b.textContent ?? '').includes('Cook a meal'),
      )!;
    // hurt → cook stays a PLAIN option (the old D-076 heal cue left with the severed mend;
    // this was RED while cook still shouted "heal now").
    render({ ...ready, character: { ...ready.character, hp: 1 } }, null);
    // FB-343/FB-369 — cook lives on the Character 己 tab's Body card now; open its chip.
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('Character'))
      ?.click();
    expect(cookBtn().classList.contains('primary')).toBe(false);
    expect(cookBtn().title).toMatch(/sickroom/i); // it says where wounds DO mend now
  });

  it('the sickroom rows: treat priced when the coin allows, HIDDEN when broke (ADR-197)', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    const bedside: GameState = {
      ...base,
      location: 'sickroom',
      character: { ...base.character, hp: 1 },
      resources: { ...base.resources, coin: balance.TREAT_COST_MON },
      flags: { ...base.flags, awake: true },
    };
    render(bedside, null);
    const row = (cls: string): HTMLElement =>
      root.querySelector<HTMLElement>(`.${cls}`)!;
    // both rows live, priced off the SAME selectors the reducer spends (AC-6)
    expect(row('place-treat').hidden).toBe(false);
    expect(row('place-treat').textContent).toContain(
      `−${balance.TREAT_COST_MON} mon`,
    );
    expect(row('place-rest-sickroom').hidden).toBe(false);
    expect(row('place-rest-sickroom').textContent).toContain(
      'Rest on the pallet',
    );
    // one mon short → the treat row HIDES (mon-only — never a shown-disabled currency
    // swap, ADR-197)… and the free rest lane stays.
    render(
      {
        ...bedside,
        resources: { ...bedside.resources, coin: balance.TREAT_COST_MON - 1 },
      },
      bedside,
    );
    expect(row('place-treat').hidden).toBe(true);
    expect(row('place-rest-sickroom').hidden).toBe(false);
  });
});

// ── ADR-119 — the seven-tab reveal CADENCE (Work R0 · Map/Estate R1 · Character R2 · Combat/Inventory
//    R3 · Quests R5). These assert the NAV chips that light at each beat, so a mis-gated tab (e.g. the
//    old Inventory-at-R1 triple-reveal, or a Quests-at-R3 batch) flips them RED. ──
// ── Multi-panel workspace: the locked byōbu+cards layout, the sticky-bottom log, the in-flow
//    pedlar buy control, and the no-empty-ghost-slice fix. DOM tests drive the real renderer. ──
describe('multi-panel workspace — locked layout, log, pedlar, ghost-box fixes', () => {
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

  function awake(surfaces: string[] = []): GameState {
    const base = createInitialState(1);
    // ADR-179 — visibility derives from facts; stamp what entitles each named surface.
    return {
      ...base,
      flags: { ...base.flags, awake: true, ...factsForSurfaces(...surfaces) },
    };
  }
  const narr = (key: number, text: string): LogEntry => ({
    key,
    channel: 'narration',
    text,
    tick: 0,
    count: 1,
  });
  function logged(entries: LogEntry[]): GameState {
    return { ...awake(), log: { entries, seq: entries.length } };
  }

  // ── FB-228 — the vn-speech colour cluster: an embedded quote in narration is a
  //    character SPEAKING (tinted by conservative one-name inference), and spoken
  //    lines step in from the narration margin. RED before FB-228: narrator-voiced
  //    lines skipped quote detection entirely, and no .spoken class existed.
  it('F228 — a Genemon quote inside a NARRATOR line tints with the steward voice', () => {
    const render = mount(root, () => {}, noopHooks());
    render(
      logged([
        {
          ...narr(0, '"Still at it," Genemon says, passing the door.'),
          voice: 'narrator',
        },
      ]),
      null,
    );
    const span = root.querySelector<HTMLElement>('.log-line .speech')!;
    expect(span).not.toBeNull();
    expect(span.style.color).toBe('var(--v-steward)');
  });

  it('F228 — quotes stay NEUTRAL when two speakers are named (ambiguous inference)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(
      logged([
        {
          ...narr(0, '"Enough," Genemon says, but Kihei only laughs.'),
          voice: 'narrator',
        },
      ]),
      null,
    );
    const span = root.querySelector<HTMLElement>('.log-line .speech')!;
    expect(span).not.toBeNull();
    expect(span.style.color).toBe(''); // never mis-tint an ambiguous quote
  });

  it('F228 — a spoken line steps in (.spoken); narrator lines hold the margin', () => {
    const render = mount(root, () => {}, noopHooks());
    render(
      logged([
        {
          ...narr(0, 'The rain holds through the morning.'),
          voice: 'narrator',
        },
        {
          ...narr(1, 'Rice, one quarter-sack, to vermin.'),
          voice: 'steward',
          speaker: 'Genemon',
        },
      ]),
      null,
    );
    const lines = [...root.querySelectorAll<HTMLElement>('.log-line')];
    expect(lines[0]!.classList.contains('spoken')).toBe(false);
    expect(lines[1]!.classList.contains('spoken')).toBe(true);
  });

  it('locks byōbu folding-columns + soft cards as the sole prod rendering (no DEV toggle)', () => {
    const render = mount(root, () => {}, noopHooks()); // no dev harness = the prod path
    render(awake(), null);
    const ws = root.querySelector<HTMLElement>('.workspace')!;
    expect(ws.dataset.layout).toBe('layout-byobu');
    expect(ws.dataset.framing).toBe('framing-cards');
    expect(root.querySelector<HTMLElement>('.shell')!.dataset.layout).toBe(
      'layout-byobu',
    );
  });

  it('F77 — a new log line pins the reader to the newest entry (sticky-bottom)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s0 = logged([
      narr(0, 'The rice is spilled.'),
      narr(1, 'You take up the rake.'),
    ]);
    render(s0, null);
    const lines = root.querySelector<HTMLElement>('.log-lines')!;
    Object.defineProperty(lines, 'scrollHeight', {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(lines, 'clientHeight', {
      configurable: true,
      value: 100,
    });
    const s1 = logged([...s0.log.entries, narr(2, 'Another line arrives.')]);
    render(s1, s0);
    expect(lines.scrollTop).toBe(500); // followed the newest line to the foot
  });

  it('F77 — a reader scrolled UP into history is NOT yanked to the bottom', () => {
    const render = mount(root, () => {}, noopHooks());
    const s0 = logged([narr(0, 'a'), narr(1, 'b')]);
    render(s0, null);
    const lines = root.querySelector<HTMLElement>('.log-lines')!;
    Object.defineProperty(lines, 'scrollHeight', {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(lines, 'clientHeight', {
      configurable: true,
      value: 100,
    });
    lines.scrollTop = 0; // the reader scrolled up to read old lines…
    lines.dispatchEvent(new Event('scroll')); // …which un-pins them from the foot
    const s1 = logged([...s0.log.entries, narr(2, 'c')]);
    render(s1, s0);
    expect(lines.scrollTop).toBe(0); // left where they were, not yanked down
  });

  it('F67/F72 — the pedlar buy control sits in its OWN in-flow cell (never a floating overlap)', () => {
    const render = mount(root, () => {}, noopHooks());
    // stand at the gate on a MARKET DAY (dayOfWeek 2) so the pedlar (Yohei) is present to talk to.
    render(
      {
        ...awake(['panel-estate', 'room-gate']),
        location: 'gate',
        clock: { ...createInitialState(1).clock, day: 2 },
      },
      null,
    );
    // FB-332 — the pedlar reads on the Zone tab (the default tab) now.
    // ADR-114 — talk to Yohei to open his wares (talk-to-reveal, never inline).
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((b) => (b.textContent ?? '').includes('Speak with Yohei'))
      ?.click();
    const rows = [
      ...root.querySelectorAll<HTMLElement>('.market-pane .market-row'),
    ];
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const item = row.querySelector('.market-item')!;
      const buy = row.querySelector('.market-buy')!;
      expect(item).not.toBeNull();
      expect(buy).not.toBeNull();
      expect(buy.querySelector('button')).not.toBeNull(); // the price button lives in the buy cell
      // the copy comes FIRST, the buy control AFTER (a vertical stack), and the button is NOT a bare
      // flex-sibling of the copy (which was the overlap-prone `space-between` row).
      const kids = [...row.children];
      expect(kids.indexOf(item)).toBeLessThan(kids.indexOf(buy));
      expect(kids.some((c) => c.tagName === 'BUTTON')).toBe(false);
    }
  });

  it('F116 — the Work-column rung ladder + its Progress slice are GONE (header rung is the sole home)', () => {
    const render = mount(root, () => {}, noopHooks());
    // even when the rung ladder would be meaningful (raked + panel unlocked), the DUPLICATE
    // Work-column ladder no longer exists — the header rung element is the single progress home.
    render(
      {
        ...awake(),
        // ADR-179 — the flags literal must carry the ladder's entitling fact itself
        // (a bare override would silently drop what awake() stamped).
        flags: {
          ...createInitialState(1).flags,
          awake: true,
          raked: true,
          ...factsForSurfaces('panel-rung-ladder'),
        },
      },
      null,
    );
    expect(root.querySelector('.work .ladder')).toBeNull(); // the Work-column ladder is removed
    expect(root.querySelector('.slice-progress')).toBeNull(); // …and so is its "Path & progress" slice
    // the rung/progress display lives in the header (FB-106), which IS shown for this state.
    expect(root.querySelector<HTMLElement>('.rung-head')!.hidden).toBe(false);
  });

  it('F94/F116 — the work slices are direct children of the .work fold (the flex-0 stacking seam)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(['panel-estate', 'room-gate', 'panel-rung-ladder']), null);
    const work = root.querySelector<HTMLElement>('.work')!;
    // The FB-94 fix (`.workspace[data-layout=layout-byobu] > .work > .slice { flex: 0 0 auto }`) can
    // only reach the slices if they are DIRECT children of `.work` — nest them deeper and the cards
    // squeeze/overlap again. Guard that seam structurally. (FB-116 dropped `slice-progress`.)
    for (const cls of ['slice-do', 'slice-estate']) {
      const slice = root.querySelector<HTMLElement>(`.${cls}`)!;
      expect(slice).not.toBeNull();
      expect(slice.parentElement).toBe(work);
    }
  });

  it('F100 (D-112) — the estate-improve card lives on the Estate tab, not the Work tab', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(['panel-estate', 'room-gate']), null);
    const worksPane = root.querySelector<HTMLElement>('.works-pane')!;
    // structural: it's grouped in the Do slice, NOT the Work-column Estate/economy slice.
    expect(root.querySelector('.slice-do .works-pane')).not.toBeNull();
    expect(root.querySelector('.slice-estate .works-pane')).toBeNull();
    // on the default Work tab the estate-improve card is hidden (no empty ghost in the Work column).
    expect(worksPane.hidden).toBe(true);
    // switch to Map — the improve card is NOT there either; it lives on Works 普請 (ADR-177).
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('地図'))
      ?.click();
    expect(worksPane.hidden).toBe(true); // NOT on the Map tab
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('普請'))
      ?.click();
    expect(worksPane.hidden).toBe(false);
    expect(worksPane.textContent ?? '').toContain('Estate ·');
  });
});

// ── FB-74 — the per-log font stepper (log-scoped scale, persisted) ─────────────────────────────────
// ── Append-only rendering migration (Phase 1) — the EASY surfaces are build-once + patch-in-place
//    (via ui/reconcile.ts), NOT a `textContent=''` rebuild. The invariant: an idle re-render of
//    UNCHANGED state produces ZERO DOM churn (no node recreated, no attribute re-written), so meter
//    transitions survive and the ~2×/s tick stops flashing. Modelled on the intro's node-identity
//    block (`FB-81`). MODE==='test' keeps the renderer synchronous. ─────────────────────────────────
describe('append-only migration — node identity + zero idle churn (Phase 1)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
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

  function awake(
    surfaces: string[] = [],
    over: Partial<GameState> = {},
  ): GameState {
    const base = createInitialState(1);
    // ADR-179 — visibility derives from facts; stamp what entitles each named surface.
    return {
      ...base,
      flags: { ...base.flags, awake: true, ...factsForSurfaces(...surfaces) },
      ...over,
    };
  }
  function openTab(marker: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes(marker))
      ?.click();
  }
  // ADR-114 — talk to Yohei on the Map's who's-here list to open his wares (talk-to-reveal).
  function talkToPedlar(): void {
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((b) => (b.textContent ?? '').includes('Speak with Yohei'))
      ?.click();
  }
  // observe a settled surface across an identical-state re-render; return the queued mutations.
  function churnOnReRender(
    el: HTMLElement,
    state: GameState,
    render: ReturnType<typeof mount>,
  ): MutationRecord[] {
    const obs = new MutationObserver(() => {});
    obs.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    render(state, state); // identical-state tick (as the 480ms auto-loop fires)
    render(state, state);
    const records = obs.takeRecords();
    obs.disconnect();
    return records;
  }

  it('renderRungHead — the header rung + meter fill survive a re-render (identity + width persists)', () => {
    // FB-116 — the Work-column ladder was removed; the HEADER rung element (renderRungHead, FB-106) is the
    // build-once/patch progress home now, so the append-only identity guard lives here.
    const render = mount(root, () => {}, noopHooks());
    const s = awake([], {
      flags: { ...createInitialState(1).flags, awake: true, raked: true },
    });
    render(s, null);
    const head = root.querySelector<HTMLElement>('.rung-head')!;
    const fill = root.querySelector<HTMLElement>('.rung-head-meter span')!;
    expect(head).not.toBeNull();
    expect(head.hidden).toBe(false); // shown once raked
    const width0 = fill.style.width;
    render(s, s);
    expect(root.querySelector('.rung-head')).toBe(head); // same node, not rebuilt
    expect(root.querySelector('.rung-head-meter span')).toBe(fill); // same fill ⇒ transition survives
    expect(fill.style.width).toBe(width0);
    expect(head.isConnected).toBe(true);
    expect(churnOnReRender(head, s, render)).toEqual([]);
  });

  it('renderMarket — a pedlar row survives a re-render (identity) and idle ticks churn nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    // a MARKET DAY (dayOfWeek 2) so Yohei stands the gate stall; the pedlar is on the Map tab now.
    const s = awake(['panel-estate', 'room-gate'], {
      location: 'gate',
      clock: { ...createInitialState(1).clock, day: 2 },
    });
    render(s, null);
    // FB-332 — who's-here + wares live on the Zone tab (the default tab).
    talkToPedlar();
    const row = root.querySelector<HTMLElement>('.market-pane .market-row')!;
    const btn = row.querySelector<HTMLButtonElement>('.market-buy button')!;
    expect(row).not.toBeNull();
    render(s, s);
    expect(root.querySelector('.market-pane .market-row')).toBe(row); // reused
    expect(row.querySelector('.market-buy button')).toBe(btn); // the click-bound button survives
    expect(row.isConnected).toBe(true);
    expect(
      churnOnReRender(
        root.querySelector<HTMLElement>('.market-pane')!,
        s,
        render,
      ),
    ).toEqual([]);
  });

  it('renderMarket — a patch reflects a changed buy state without recreating the row', () => {
    const seen: Intent[] = [];
    const render = mount(root, (i) => seen.push(i), noopHooks());
    const s = awake(['panel-estate', 'room-gate'], {
      location: 'gate',
      clock: { ...createInitialState(1).clock, day: 2 }, // a market day → Yohei is present
      resources: { ...createInitialState(1).resources, coin: 0 },
    });
    render(s, null);
    // FB-332 — the pedlar reads on the Zone tab (the default tab) now.
    talkToPedlar(); // ADR-114 — open his wares by talking (never inline)
    const row = root.querySelector<HTMLElement>('.market-pane .market-row')!;
    const btn = row.querySelector<HTMLButtonElement>('.market-buy button')!;
    expect(btn.disabled).toBe(true); // no coin → can't buy
    // afford it → the SAME button becomes enabled (patched in place, not a fresh node).
    const rich = awake(['panel-estate', 'room-gate'], {
      location: 'gate',
      clock: { ...createInitialState(1).clock, day: 2 },
      resources: { ...createInitialState(1).resources, coin: 9999 },
    });
    render(rich, s);
    expect(root.querySelector('.market-pane .market-row')).toBe(row);
    expect(row.querySelector('.market-buy button')).toBe(btn);
    expect(btn.disabled).toBe(false);
    btn.click();
    expect(seen.some((i) => i.type === 'buy_item')).toBe(true); // listener still bound
  });

  it('renderSkills — a skill card + meter survive a re-render, empty pane stays empty (F72)', () => {
    const render = mount(root, () => {}, noopHooks());
    // tab-skills open but no skill has any XP yet. ADR-179 — tab-skills is a rank-r2 grant,
    // and rank-r2 ALSO grants skill-conditioning (rung-granted surfaces travel together), so
    // the pane can no longer be literally empty at R2: the conditioning gate card rides in.
    // The FB-72 ghost-box contract holds in its coarser form — ONLY the schedule-granted
    // card renders; no XP-earned row appears un-earned.
    const s = awake(['tab-skills', 'readout-combat-level']);
    render(s, null);
    openTab('己'); // skills is a section of the Character 己 tab now (IA reorg ADR-112)
    const rows0 = [
      ...root.querySelectorAll<HTMLElement>('.skills-pane .skill-row'),
    ];
    expect(rows0.length).toBe(1); // the rank-granted conditioning card, nothing else
    expect(rows0[0]!.textContent).toContain('Conditioning');

    // give farming enough XP to surface its skill card, then prove identity across a tick.
    const withSkill = awake(['tab-skills', 'readout-combat-level'], {
      skillXp: { ...createInitialState(1).skillXp, farming: 50 },
    });
    render(withSkill, s);
    const card = root.querySelector<HTMLElement>('.skills-pane .skill-row')!;
    const fill = card.querySelector<HTMLElement>('.meter span')!;
    expect(card).not.toBeNull();
    render(withSkill, withSkill);
    expect(root.querySelector('.skills-pane .skill-row')).toBe(card); // reused, not rebuilt
    expect(card.querySelector('.meter span')).toBe(fill); // fill persists ⇒ transition survives
    expect(
      churnOnReRender(
        root.querySelector<HTMLElement>('.skills-pane')!,
        withSkill,
        render,
      ),
    ).toEqual([]);
  });

  it('renderQuests — a quest card survives a re-render and idle ticks churn nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['tab-combat', 'tab-quests']); // ADR-119 — Quests is its OWN tab now (revealed R5)
    render(s, null);
    openTab('Quests'); // the Quests 用 tab (ADR-119, reinstating ADR-037)
    const card = root.querySelector<HTMLElement>('.quests-pane .quest-card')!;
    expect(card).not.toBeNull();
    render(s, s);
    expect(root.querySelector('.quests-pane .quest-card')).toBe(card); // reused
    expect(card.isConnected).toBe(true);
    expect(
      churnOnReRender(
        root.querySelector<HTMLElement>('.quests-pane')!,
        s,
        render,
      ),
    ).toEqual([]);
  });

  it('renderStorehouse — the kura card survives a re-render; idle ticks churn nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['panel-estate', 'tab-inventory'], { location: 'kura' }); // ADR-177 — Inventory reveals R4
    render(s, null);
    openTab('蔵'); // the kura bank is on the Inventory 蔵 tab now (FB-108 / IA reorg ADR-112)
    const card = root.querySelector<HTMLElement>(
      '.storehouse-pane .rung-card',
    )!;
    expect(card).not.toBeNull();
    render(s, s);
    expect(root.querySelector('.storehouse-pane .rung-card')).toBe(card);
    expect(
      churnOnReRender(
        root.querySelector<HTMLElement>('.storehouse-pane')!,
        s,
        render,
      ),
    ).toEqual([]);
  });

  it('renderWorks — the improve card survives a re-render (Works tab, ADR-177)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['panel-estate', 'room-gate']);
    render(s, null);
    openTab('普請'); // ADR-177 Schedule A — the improve card lives on the Works 普請 tab now
    const card = root.querySelector<HTMLElement>('.works-pane .rung-card')!;
    expect(card.textContent).toContain('Estate ·');
    render(s, s);
    expect(root.querySelector('.works-pane .rung-card')).toBe(card); // reused
    expect(
      churnOnReRender(
        root.querySelector<HTMLElement>('.works-pane')!,
        s,
        render,
      ),
    ).toEqual([]);
  });

  it('renderNowView — a fleeting Now line survives a re-render; idle ticks churn nothing (D-123)', () => {
    // ADR-123 closes the last wholesale-rebuild surface: the Now view now RECONCILES its ephemeral
    // lines instead of `textContent=''` + rebuild. RED against the old rebuild — every idle tick
    // recreated the node (churn) and dropped its identity.
    const render = mount(root, () => {}, noopHooks());
    // FB-406 retired the move-arrival line, so the ephemeral feed here is a REST
    // (its result line is `ephemeral: true` — FB-53), which still feeds the Now view.
    // verb-rest's fact is the `raked` flag, so set it the way the game does.
    let s = awake([], { location: 'forecourt' });
    s = { ...s, flags: { ...s.flags, raked: true } };
    s = reduce(s, { type: 'rest' });
    render(s, null);
    // switch the log to the "Now" filter so the ephemeral line is stamped + painted.
    [...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab')]
      .find((b) => (b.textContent ?? '') === 'Now')
      ?.click();
    const logLines = root.querySelector<HTMLElement>('.log-lines')!;
    const nowLine = logLines.querySelector<HTMLElement>('.now-line');
    expect(nowLine).not.toBeNull(); // the fleeting line reached the Now view
    render(s, s);
    expect(logLines.querySelector('.now-line')).toBe(nowLine); // SAME node — reconciled, not rebuilt
    expect(churnOnReRender(logLines, s, render)).toEqual([]); // idle ticks churn nothing
  });

  it('renderMap — the you-are-here card + survey sheet survive a re-render (the sig guard)', () => {
    const render = mount(root, () => {}, noopHooks());
    // forecourt so the paddy is a walkable neighbour with a live [data-node] travel seal.
    const s = awake(['room-gate', 'room-paddies'], { location: 'forecourt' });
    render(s, null);
    openTab('地図');
    const card = root.querySelector<HTMLElement>('.map-pane .map-here')!;
    const blurb = card.querySelector<HTMLElement>('.skill-blurb')!;
    const node = root.querySelector<HTMLElement>(
      '.map-pane [data-node="paddies"]',
    )!;
    expect(card).not.toBeNull();
    render(s, s);
    // the CARD frame + its header/blurb persist — and the survey sheet is zero-churn behind the
    // mapSignature guard: the SAME travel node survives an idle re-render (no wholesale repaint).
    expect(root.querySelector('.map-pane .map-here')).toBe(card);
    expect(card.querySelector('.skill-blurb')).toBe(blurb);
    expect(root.querySelector('.map-pane [data-node="paddies"]')).toBe(node);
    expect(card.isConnected).toBe(true);
    expect(
      churnOnReRender(root.querySelector<HTMLElement>('.map-pane')!, s, render),
    ).toEqual([]);
  });

  it('FB-333 — the clock reads season + weekday (day 0 = Monday 月), never a year/day counter', () => {
    const render = mount(root, () => {}, noopHooks());
    const s0 = awake(['readout-clock']);
    render(s0, null);
    const clock = root.querySelector<HTMLElement>('.vital.clock')!;
    expect(clock.hidden).toBe(false);
    // day 0 is the canon anchor: Monday 月 (the day the river gives him up).
    expect(clock.textContent).toContain('月 Monday');
    // the absolute count is GONE — the player lives by the week, not a day/year meter.
    expect(clock.textContent).not.toMatch(/Year|· day/);
    // the weekday rolls with the clock: day 2 (Yohei's market day) reads Wednesday 水.
    render(awake(['readout-clock'], { clock: { ...s0.clock, day: 2 } }), null);
    expect(clock.textContent).toContain('水 Wednesday');
  });
});

// ── Append-only migration (Phase 2) — the two big flash offenders. `renderActions` (the Work hero,
//    rebuilt ~2×/s) and `renderCombat` (a 6-block composite) are split into named build-once
//    sub-containers + keyed reconcile lists; the invariant is the same as Phase 1: an idle re-render
//    of UNCHANGED state produces ZERO DOM churn (the auto-toggle the player watches keeps its node
//    and focus, the combat forecast pips patch in place instead of strobing). ──────────────────────
// ── Append-only migration (Phase 2) — the two big flash offenders. `renderActions` (the Work hero,
//    rebuilt ~2×/s) and `renderCombat` (a 6-block composite) are split into named build-once
//    sub-containers + keyed reconcile lists; the invariant is the same as Phase 1: an idle re-render
//    of UNCHANGED state produces ZERO DOM churn (the auto-toggle the player watches keeps its node
//    and focus, the combat forecast pips patch in place instead of strobing). ──────────────────────
describe('append-only migration — renderActions + renderCombat (Phase 2)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
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

  function awake(
    surfaces: string[] = [],
    over: Partial<GameState> = {},
  ): GameState {
    const base = createInitialState(1);
    // ADR-179 — visibility derives from facts; stamp what entitles each named surface.
    return {
      ...base,
      flags: { ...base.flags, awake: true, ...factsForSurfaces(...surfaces) },
      ...over,
    };
  }
  function combat(
    extra: string[] = [],
    over: Partial<GameState> = {},
  ): GameState {
    // G4: foes are spatial — the field margins is the first grindable combat zone (tanuki/badger).
    return awake(['tab-combat', 'panel-bestiary', ...extra], {
      location: 'field-margins',
      ...over,
    });
  }
  function openTab(marker: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes(marker))
      ?.click();
  }
  function churnOnReRender(
    el: HTMLElement,
    state: GameState,
    render: ReturnType<typeof mount>,
  ): MutationRecord[] {
    const obs = new MutationObserver(() => {});
    obs.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    render(state, state);
    render(state, state);
    const records = obs.takeRecords();
    obs.disconnect();
    return records;
  }

  it('renderActions — the labour row + its auto-toggle survive; idle churns nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    // a labour node with an auto-labour running (the auto-toggle the player is watching must not
    // re-create / lose focus on the ~2×/s tick). FB-107 (ADR-112): the "Walk on 道" nav strip is GONE
    // from Work — navigation's sole home is the Map tab, so move-node identity is asserted in the
    // renderMap test above (`.map-pane .map-move` survives a re-render), not here.
    const s = awake(['verb-farm', 'room-paddies', 'room-gate'], {
      location: 'paddies',
      autoActivity: 'farm_paddy',
    });
    render(s, null);
    const actions = root.querySelector<HTMLElement>('.actions')!;
    const labourBtn = [
      ...actions.querySelectorAll<HTMLButtonElement>('.area-group .verb'),
    ].find((b) => (b.textContent ?? '').includes('Work the home paddies'))!;
    const auto = actions.querySelector<HTMLButtonElement>(
      '.area-group .auto-toggle',
    )!;
    expect(auto).not.toBeNull();
    expect(auto.classList.contains('on')).toBe(true); // the auto-labour is running
    // the Work tab holds no nav strip anymore (FB-107) — its sole home is Map.
    expect(actions.querySelector('.walk-on')).toBeNull();
    render(s, s);
    // every node the player can touch is REUSED, not rebuilt (focus + auto-run survive).
    expect(
      [
        ...actions.querySelectorAll<HTMLButtonElement>('.area-group .verb'),
      ].find((b) => (b.textContent ?? '').includes('Work the home paddies')),
    ).toBe(labourBtn);
    expect(actions.querySelector('.area-group .auto-toggle')).toBe(auto);
    expect(auto.isConnected).toBe(true);
    expect(churnOnReRender(actions, s, render)).toEqual([]);
  });

  it('renderActions — toggling auto-labour patches the SAME toggle node in place (no re-create)', () => {
    const seen: Intent[] = [];
    const render = mount(root, (i) => seen.push(i), noopHooks());
    const off = awake(['verb-farm', 'room-paddies'], { location: 'paddies' });
    render(off, null);
    const auto = root.querySelector<HTMLButtonElement>(
      '.actions .area-group .auto-toggle',
    )!;
    expect(auto.classList.contains('on')).toBe(false);
    // start the auto-labour → the SAME node flips `.on` (patched, not remounted); its listener holds.
    const on = awake(['verb-farm', 'room-paddies'], {
      location: 'paddies',
      autoActivity: 'farm_paddy',
    });
    render(on, off);
    expect(root.querySelector('.actions .area-group .auto-toggle')).toBe(auto);
    expect(auto.classList.contains('on')).toBe(true);
    auto.click();
    expect(seen.some((i) => i.type === 'set_auto')).toBe(true);
  });

  it('FB-410 (HR-32) — the zone banner names the place and carries its standing line before the verbs', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['verb-farm', 'room-paddies'], { location: 'paddies' });
    render(s, null);
    const banner = root.querySelector<HTMLElement>('.zone-banner')!;
    expect(banner).not.toBeNull();
    expect(banner.hidden).toBe(false);
    // the hero names WHERE you stand (TST4) — kanji + label, both off the node (one source).
    const here = getNode(s.location);
    expect(banner.querySelector('.zb-kanji')!.textContent).toBe(here.kanji);
    expect(banner.querySelector('.zb-name')!.textContent).toBe(here.label);
    // the standing line is the SAME seasonal read the Map card resolves — derived here from the
    // source, never a copied string, so re-authoring the prose can't leave this test green-but-stale.
    const line = banner.querySelector<HTMLElement>('.zb-blurb')!;
    expect(line.textContent).toBe(nodeSeasonalBlurb(here, s.season).text);
    // …and it reads BETWEEN the hero and the first verb (the human's pick: text in the gap).
    const kids = [...banner.children];
    expect(kids.findIndex((k) => k.matches('.zb-blurb'))).toBeGreaterThan(
      kids.findIndex((k) => k.matches('.zb-head')),
    );
    expect(
      banner.compareDocumentPosition(root.querySelector('.actions .verb')!),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    // the group under it carries the rows ONLY — no second name for the same ground.
    expect(root.querySelector('.area-head')).toBeNull();
    // and the banner patches in place: an idle re-render churns nothing (P4/TST2).
    expect(churnOnReRender(banner, s, render)).toEqual([]);
  });

  it('renderCombat — the XP card + a foe-watch row survive a re-render; idle churns nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = combat();
    render(s, null);
    openTab('Combat');
    const pane = root.querySelector<HTMLElement>('.combat-pane')!;
    const xp = pane.querySelector<HTMLElement>('.rung-card')!;
    const foe = pane.querySelector<HTMLElement>(
      '.foe-row:not(.bestiary-card)',
    )!;
    expect(xp).not.toBeNull();
    expect(foe).not.toBeNull();
    render(s, s);
    expect(pane.querySelector('.rung-card')).toBe(xp); // XP card reused
    expect(pane.querySelector('.foe-row:not(.bestiary-card)')).toBe(foe); // watch row reused
    expect(foe.isConnected).toBe(true);
    expect(churnOnReRender(pane, s, render)).toEqual([]);
  });

  it('renderCombat — a foe-watch row inks fog→forecast IN PLACE (same row + win-rate node)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = combat(); // the field-margin foe stands unseen (fogged)
    render(s, null);
    openTab('Combat');
    const pane = root.querySelector<HTMLElement>('.combat-pane')!;
    const foe = pane.querySelector<HTMLElement>(
      '.foe-row:not(.bestiary-card)',
    )!;
    const wr = foe.querySelector<HTMLElement>('.win-rate')!;
    expect(foe.querySelector('.skill-name')!.textContent).toBe('Unknown foe');
    expect(wr.textContent).toContain('Unknown');
    // face THIS node's first foe → the SAME row + the SAME win-rate node patch to a real forecast.
    const facedIt = setFlag(s, `mob-${foesHere(s)[0]!.mob.id}`);
    render(facedIt, s);
    expect(pane.querySelector('.foe-row:not(.bestiary-card)')).toBe(foe); // row not recreated
    expect(foe.querySelector('.win-rate')).toBe(wr); // forecast pip patched in place
    expect(foe.querySelector('.skill-name')!.textContent).not.toBe(
      'Unknown foe',
    );
    expect(wr.textContent).toContain('%');
  });
});

// ── Phase B (ADR-114 vendors-as-people + ADR-116 location flavor) — the pedlar (Yohei) is a talkable
//    person on the Map's "who's here" list; his wares open only by TALKING (never inline); and the
//    move-arrival flavor is a transient Now line, not a permanent Story entry. ──────────────────────

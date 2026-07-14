// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { nodeSeasonalBlurb } from '../../core';
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '../render';
import {
  createInitialState,
  reduce,
  getNode,
  getPerson,
  balance,
  type GameState,
  type Intent,
  factsForSurfaces,
} from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { noopHooks } from './test-utils';

// ── Phase B (ADR-114 vendors-as-people + ADR-116 location flavor) — the pedlar (Yohei) is a talkable
//    person on the Map's "who's here" list; his wares open only by TALKING (never inline); and the
//    move-arrival flavor is a transient Now line, not a permanent Story entry. ──────────────────────
describe('IA reorg Phase B — vendors-as-people (D-114) + location flavor (D-116)', () => {
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

  function awakeAt(location: string, surfaces: string[] = []): GameState {
    const base = createInitialState(1);
    // ADR-179 — visibility derives from facts; stamp what entitles each named surface.
    return {
      ...base,
      location,
      flags: { ...base.flags, awake: true, ...factsForSurfaces(...surfaces) },
    };
  }
  function clickButton(substr: string): boolean {
    const btn = [...root.querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => (b.textContent ?? '').includes(substr),
    );
    btn?.click();
    return Boolean(btn);
  }

  it('the Map "who\'s here" lists the pedlar (Yohei) at his node — a talk affordance', () => {
    const render = mount(root, () => {}, noopHooks());
    const pedlar = getPerson('yohei'); // source of truth: his node + name (G4: Yohei, at the gate)
    // Yohei stands his stall on his MARKET DAYS (dayOfWeek 2) — put us on one so he is present.
    render(
      {
        ...awakeAt(pedlar.node, ['room-gate', 'panel-estate']),
        clock: { ...createInitialState(1).clock, day: 2 },
      },
      null,
    );
    // FB-332 — who's-here lives on the Zone tab (the default tab), beside the zone's actions.
    const whos = root.querySelector<HTMLElement>('.slice-do .whos-here')!;
    expect(whos).not.toBeNull();
    expect(whos.hidden).toBe(false);
    const rows = [
      ...root.querySelectorAll<HTMLElement>('.whos-here .person-row'),
    ];
    expect(rows.some((r) => (r.textContent ?? '').includes(pedlar.name))).toBe(
      true,
    );
    // …and a Speak affordance for him (talk-to-reveal — his shop is not dumped inline).
    expect(
      [
        ...root.querySelectorAll<HTMLButtonElement>('.whos-here .person-talk'),
      ].some((b) =>
        (b.textContent ?? '').includes(`Speak with ${pedlar.name}`),
      ),
    ).toBe(true);
  });

  it('talking to the pedlar OPENS his wares — the shop is hidden until you speak to him', () => {
    const render = mount(root, () => {}, noopHooks());
    render(
      {
        ...awakeAt('gate', ['room-gate', 'panel-estate']),
        clock: { ...createInitialState(1).clock, day: 2 },
      },
      null,
    );
    // FB-332 — the flow lives on the Zone tab (the default tab).
    // BEFORE talking: the pedlar's wares are NOT rendered inline.
    expect(root.querySelector('.market-pane .market-row')).toBeNull();
    expect(root.querySelector<HTMLElement>('.market-pane')!.hidden).toBe(true);
    // talk → the trade panel opens (his MARKET_ITEMS rows + the sell-rice faucet).
    expect(clickButton('Speak with Yohei')).toBe(true);
    expect(root.querySelector<HTMLElement>('.market-pane')!.hidden).toBe(false);
    expect(
      root.querySelectorAll('.market-pane .market-row').length,
    ).toBeGreaterThan(0);
  });

  it("the pedlar's shop is NEVER inline on the Zone tab (talk-to-reveal only)", () => {
    const render = mount(root, () => {}, noopHooks());
    // awake at the forecourt with the economy open, sitting on the default Zone tab.
    render(awakeAt('gate', ['room-gate', 'panel-estate']), null);
    // no wares are built before talking, and the market pane is hidden (FB-332 — the rows
    // now live HERE on the Zone tab, but the shop still opens only by speaking, ADR-114).
    expect(root.querySelector('.market-pane .market-row')).toBeNull();
    expect(root.querySelector<HTMLElement>('.market-pane')!.hidden).toBe(true);
    // the person rows are the whos-here section, never dumped among the action buttons.
    expect(root.querySelector('.actions .person-row')).toBeNull();
  });

  it("a PRESENCE-gated vendor (Yohei) appears in who's-here only WHEN he's present (D-114)", () => {
    // G4 cutover: the T0 cast gates on PRESENCE (WHO is WHERE WHEN), not placeGate — no T0 person
    // uses placeGate (people.test.ts). Yohei stands the gate ONLY on his market days (dayOfWeek 2),
    // so his who's-here row appears / vanishes with the day — the same reveal-as-plot filter.
    const render = mount(root, () => {}, noopHooks());
    const yohei = getPerson('yohei');
    const clock = createInitialState(1).clock;
    // an OFF day (dayOfWeek 1) → Yohei is not at the gate: his row is the FB-408
    // dimmed AWAY row (schedule hint, no Speak button), never a live person row.
    render(
      {
        ...awakeAt(yohei.node, ['room-gate', 'panel-estate']),
        clock: { ...clock, day: 1 },
      },
      null,
    );
    // FB-332 — who's-here reads on the Zone tab (the default tab).
    const yoheiRows = () =>
      [...root.querySelectorAll<HTMLElement>('.whos-here .person-row')].filter(
        (r) => (r.textContent ?? '').includes(yohei.name),
      );
    expect(yoheiRows().every((r) => r.classList.contains('person-away'))).toBe(
      true,
    );
    expect(
      yoheiRows().some((r) => r.querySelector('.person-talk') !== null),
    ).toBe(false);
    // a MARKET day (dayOfWeek 2) → Yohei joins the who's-here list as a LIVE row.
    render(
      {
        ...awakeAt(yohei.node, ['room-gate', 'panel-estate']),
        clock: { ...clock, day: 2 },
      },
      null,
    );
    expect(
      yoheiRows().some(
        (r) =>
          !r.classList.contains('person-away') &&
          r.querySelector('.person-talk') !== null,
      ),
    ).toBe(true);
  });

  it('FB-406 — a move emits NO log flavor at all; the zone read is RENDERED, never logged', () => {
    // Supersedes the D-116 arrival-line half: the human doesn't want zone reads floating
    // through Now on every walk. The read is rendered where you look — the Map's you-are-here
    // card and (HR-32) the Zone banner, both off the same source — but it never enters the log.
    const dest = 'gate';
    // stand at the forecourt (adjacent to the gate) so the walk is a real one-step move.
    const s0 = awakeAt('forecourt', [getNode(dest).revealFlag!]);
    const moved = reduce(s0, { type: 'move_to', to: dest }); // walk to the gate
    const blurb = nodeSeasonalBlurb(getNode(dest), moved.season).text;
    // no entry in ANY view carries the zone read — the emit is gone, not just re-routed.
    expect(moved.log.entries.some((e) => e.text.includes(blurb))).toBe(false);
  });
});

// FB-102 / ADR-115 / ADR-116 — the Map splits into (a) a bordered you-are-here FLAVOR card and (b) a
// terse, HINT-FREE navigation section. You move by CLICKING a road (no separate "go" button), and
// no unvisited node leaks a loot/foe/reward hint (the flavor updates on ARRIVAL). The prod DEFAULT
// (map-a) is the terse paths list — these tests drive the SHIPPED path (no DEV harness).
// FB-102 / ADR-115 / ADR-116 — the Map splits into (a) a bordered you-are-here FLAVOR card and (b) a
// terse, HINT-FREE navigation section. You move by CLICKING a road (no separate "go" button), and
// no unvisited node leaks a loot/foe/reward hint (the flavor updates on ARRIVAL). The prod DEFAULT
// (map-a) is the terse paths list — these tests drive the SHIPPED path (no DEV harness).
describe('Estate map — flavor card + the 絵図 survey-plan sheet (F102 / HR-7 pick)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    root = document.createElement('div');
    document.body.append(root);
  });
  function openMapTab(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('地図'))
      ?.click();
  }
  function at(location: string, surfaces: string[] = []): GameState {
    const base = createInitialState(1);
    // ADR-179 — visibility derives from facts; stamp what entitles each named surface.
    return {
      ...base,
      location,
      flags: { ...base.flags, awake: true, ...factsForSurfaces(...surfaces) },
    };
  }
  function spyRender(): { seen: Intent[]; render: ReturnType<typeof mount> } {
    const seen: Intent[] = [];
    return { seen, render: mount(root, (i) => seen.push(i), noopHooks()) };
  }

  it('renders the flavor card (current-node blurb) + the survey sheet; a seal click walks there', () => {
    const { seen, render } = spyRender();
    // stand at the forecourt (the R0 hub) — the paddy is one of its walkable neighbours.
    render(at('forecourt', ['room-gate', 'room-paddies']), null);
    openMapTab();
    const flavor = root.querySelector<HTMLElement>('.map-pane .map-here')!;
    const nav = root.querySelector<HTMLElement>('.map-pane .map-nav')!;
    expect(flavor).not.toBeNull();
    expect(nav).not.toBeNull();
    // (a) the flavor carries the CURRENT node's immersive description (seasonal, C5a)…
    expect(flavor.textContent).toContain(
      nodeSeasonalBlurb(getNode('forecourt'), 'winter').text,
    );
    // …and (b) the sheet is a SIBLING section, not nested inside the flavor card.
    expect(flavor.contains(nav)).toBe(false);
    // the sheet actually painted: the title cartouche is on the sheet.
    expect(nav.textContent).toContain('黒沢家領内絵図');
    // click-to-move: a node's seal walks there (the real move_to; no separate go button).
    const seal = nav.querySelector<HTMLElement>(
      '[data-node="paddies"]:not([data-locked])',
    )!;
    expect(seal).not.toBeNull();
    seal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(seen).toContainEqual({ type: 'move_to', to: 'paddies' });
  });

  it('FB-336 — the sheet is the tab hero: it mounts BEFORE the you-are-here card, log folds away', () => {
    const { render } = spyRender();
    render(at('forecourt', ['room-gate']), null);
    openMapTab();
    const pane = root.querySelector<HTMLElement>('.map-pane')!;
    const kids = [...pane.children];
    const nav = pane.querySelector<HTMLElement>('.map-nav')!;
    const card = pane.querySelector<HTMLElement>('.map-here')!;
    // scroll order: map first, then the zone description below it (human ruling, FB-336)
    expect(kids.indexOf(nav)).toBeLessThan(kids.indexOf(card));
    // the CSS hook that folds the log column away on this tab is stamped on the root
    expect(root.dataset.activeTab).toBe('map');
  });

  it('unsurveyed ground stays UNNAMED (reveal-as-plot) and no destination blurb leaks', () => {
    const { render } = spyRender();
    // at the paddies with the paddy surveyed but the woodlot (one step past) still unsurveyed.
    render(at('paddies', ['room-gate', 'room-paddies']), null);
    openMapTab();
    const text =
      root.querySelector<HTMLElement>('.map-pane .map-nav')!.textContent ?? '';
    // the frontier destination's blurb never leaks into the sheet (updates on ARRIVAL, ADR-116)…
    expect(text).not.toContain(getNode('woodlot').blurb);
    // …and the frontier past surveyed ground is a blank 未測 wash — an unrevealed node is
    // NEVER named on the sheet (the woodlot sits one step past the revealed paddies).
    expect(text).toContain('未測');
    expect(text).not.toContain(getNode('woodlot').label);
  });

  it('a conditioning-locked node is GREYED + inert with its reason VISIBLE (not hidden)', () => {
    const { seen, render } = spyRender();
    // at the paddies with the field margins (a danger-ring neighbour) surveyed but conditioning
    // not yet trained — the edge is walkable-in-principle but gated on the skill.
    render(
      at('paddies', ['room-paddies', 'room-gate', 'room-field-margins']),
      null,
    );
    openMapTab();
    const nav = root.querySelector<HTMLElement>('.map-pane .map-nav')!;
    const locked = nav.querySelector<HTMLElement>(
      '[data-locked][data-node="field-margins"]',
    )!;
    expect(locked).not.toBeNull();
    expect(locked.dataset.locked).toBe('1');
    expect(locked.getAttribute('aria-disabled')).toBe('true');
    // inert: clicking a gated seal walks nowhere.
    locked.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(seen.some((i) => i.type === 'move_to')).toBe(false);
    // the reason is VISIBLE on the sheet (the 険 caption), never a dead grey box.
    expect(nav.textContent).toContain(
      `Needs Conditioning Lv${balance.CONDITIONING_GATE_LEVEL}`,
    );
  });

  it('FB-341 — a revealed seal beyond one step is INERT: no travel wiring, no walk', () => {
    const { seen, render } = spyRender();
    // at the gate the ONLY neighbour is the forecourt — the woodshed, though revealed,
    // is two hops away and must read disabled (aria-disabled, no button role, no
    // pointer), not clickable-but-dead.
    render(at('gate', ['room-gate', 'room-woodshed']), null);
    openMapTab();
    const nav = root.querySelector<HTMLElement>('.map-pane .map-nav')!;
    const far = nav.querySelector<HTMLElement>('[data-far="woodshed"]');
    expect(far).not.toBeNull();
    expect(far!.getAttribute('aria-disabled')).toBe('true');
    // never wired as a travel control — role=button + the pointer cursor are wireTravel's.
    expect(far!.getAttribute('role')).toBeNull();
    expect(far!.style.cursor).not.toBe('pointer');
    // …and clicking it walks nowhere.
    far!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(seen.some((i) => i.type === 'move_to')).toBe(false);
  });

  it('FB-339 — the sheet carries its viewer chrome: zoom/fit/full controls + the L10 register', () => {
    const { render } = spyRender();
    render(at('forecourt', ['room-gate', 'room-paddies']), null);
    openMapTab();
    const nav = root.querySelector<HTMLElement>('.map-pane .map-nav')!;
    // the ported control strip (zoom in/out · fit · full), each a real labelled button…
    const labels = [
      ...nav.querySelectorAll<HTMLButtonElement>('button.sheetmap-zoom'),
    ].map((b) => b.getAttribute('aria-label'));
    expect(labels).toEqual([
      'Zoom in',
      'Zoom out',
      'Fit the whole sheet',
      'Full-screen the map',
    ]);
    // …and the fine-register zoom gate (map-spec L10) hangs off data-zoom from first paint
    // (the default fit framing reads 'far' — the fit view stays composed).
    expect(nav.querySelector('svg')!.getAttribute('data-zoom')).toBe('far');
  });

  it('FB-339 — the viewer chrome survives jsdom: zoom clicks, wheel & drag never throw', () => {
    // jsdom implements neither getScreenCTM nor DOMPoint nor setPointerCapture — this is
    // the exact failure the pre-push full-mount sweep tripped on (2026-07-10). Exercising
    // every interaction path here keeps the guard load-bearing regardless of sweep order.
    const { render } = spyRender();
    render(at('forecourt', ['room-gate', 'room-paddies']), null);
    openMapTab();
    const nav = root.querySelector<HTMLElement>('.map-pane .map-nav')!;
    for (const b of nav.querySelectorAll<HTMLButtonElement>(
      'button.sheetmap-zoom',
    ))
      b.click();
    const svg = nav.querySelector('svg')!;
    expect(() => {
      svg.dispatchEvent(
        new WheelEvent('wheel', {
          deltaY: -120,
          bubbles: true,
          cancelable: true,
        }),
      );
      svg.dispatchEvent(
        new MouseEvent('pointerdown', {
          button: 0,
          clientX: 10,
          clientY: 10,
          bubbles: true,
        }),
      );
      svg.dispatchEvent(
        new MouseEvent('pointermove', {
          clientX: 80,
          clientY: 60,
          bubbles: true,
        }),
      );
      svg.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    }).not.toThrow();
  });
});

// ── FB-111 · the "Chat" log tab — the OPTIONAL Q&A you chose to ask, split off from the MANDATORY
//    Story. A chat line is `narration` + `chat:true`; the filter routes it to Chat (+ All), never
//    Story. FB-104/FB-105 · the footer version is clickable → the About modal, which deep-links the raw
//    CHANGELOG on GitHub. FB-115 · the Now expiry runs on wall time regardless of the active view. ──

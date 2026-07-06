// @vitest-environment jsdom
//
// The feel-pass (Commit 8) render assertions: the pure ×N log formatter, the
// unknown-foe fog gating, and the settings-modal a11y (textarea labels + Tab
// focus-trap). DOM tests mount the real renderer and drive it like the app does.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, formatLogText, NOW_TTL_MS, type AppHooks } from './render';
import { LOG_SCALE_MIN, LOG_SCALE_MAX, LOG_SCALE_STEP, LOG_SCALE_DEFAULT } from './ui-prefs';
import {
  createInitialState,
  foesHere,
  setFlag,
  reduce,
  getNode,
  getPerson,
  balance,
  formatKMB,
  gradeOf,
  DIALOGUE_SCENES,
  ATTR_META,
  getRank,
  nextRankId,
  promotionReady,
  RUNG_BEATS,
  getBelonging,
  getWeapon,
  durabilityBand,
  type GameState,
  type Intent,
  type LogEntry,
} from '../core';

function entry(text: string, count: number, channel: LogEntry['channel'] = 'reward'): LogEntry {
  return { key: 0, channel, text, tick: 0, count };
}

describe('formatLogText — coalesced ×N display', () => {
  it('leaves a single (count 1) line untouched', () => {
    expect(formatLogText(entry('You fell the crop-raiding monkey. (+3 coin)', 1))).toBe(
      'You fell the crop-raiding monkey. (+3 coin)',
    );
  });

  it('multiplies a single-resource suffix into a running total', () => {
    expect(formatLogText(entry('You fell the crop-raiding monkey. (+3 coin)', 12))).toBe(
      'You fell the crop-raiding monkey. ×12 (+36 coin)',
    );
    expect(formatLogText(entry('Work the home paddies. (+4 rice)', 7))).toBe(
      'Work the home paddies. ×7 (+28 rice)',
    );
  });

  it('never multiplies a multi-resource suffix (bare ×N fallback)', () => {
    expect(formatLogText(entry('Forage the near satoyama. (+2 sansai, +1 coin)', 5))).toBe(
      'Forage the near satoyama. (+2 sansai, +1 coin) ×5',
    );
  });

  it('falls back to a bare ×N on a non-suffix line', () => {
    expect(formatLogText(entry('The monkey drives you back.', 3, 'combat'))).toBe(
      'The monkey drives you back. ×3',
    );
  });
});

// ── DOM harness ─────────────────────────────────────────────────────────────
function noopHooks(): AppHooks {
  let muted = false;
  return {
    exportSave: () => 'SAVE-CODE',
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

function awakeCombatState(): GameState {
  const base = createInitialState(1);
  return {
    ...base,
    // Step 5b: foes are spatial — stand on the home paddies (the first grindable node: monkey +
    // boar) so the combat pane's "watch" actually has foes to show.
    location: 'home-paddies',
    flags: { ...base.flags, awake: true },
    unlocked: [...base.unlocked, 'readout-rice', 'tab-combat'],
  };
}

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
      new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
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
    const combatTab = [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')].find((b) =>
      (b.textContent ?? '').includes('Combat'),
    )!;
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
      flags: { ...s.flags, awake: true, 'rank-r7': true, 't0-capstone': true, 'ascended-t0': true },
      // panel-estate (via panel-rung-ladder) is what lights the Estate tab, the koku standing's home.
      unlocked: [...s.unlocked, 'panel-rung-ladder', 'panel-estate', 'panel-house-influence'],
      influence: { estate: { value: excellent, highWater: excellent, judged: 0 } },
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
    expect(panel.textContent).not.toContain('Reach Excellent standing to ascend');
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
      flags: { ...s.flags, awake: true, 't0-capstone': true }, // phaseOf === 2 → the pillar is live
      // panel-estate lights the Estate tab (the koku standing's IA home); panel-house-influence
      // makes the standing live. Both are unlocked by R7 in real play.
      unlocked: [...s.unlocked, 'panel-rung-ladder', 'panel-estate', 'panel-house-influence'],
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
      expect(gradeEl.className).toContain(`grade-${gradeOf(value).toLowerCase()}`);
    }
  });

  it('D-107 Ph4 — the standing names the daimyō horizon at 10,000 koku (D-109)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(liveHouse(balance.ESTATE_BANDS.great), null);
    openTab('家');
    const panel = root.querySelector<HTMLElement>('.influence-panel')!;
    // the mythic ceiling, derived from the single-source DAIMYO_KOKU (not a hard-typed "10,000").
    expect(panel.textContent).toContain(balance.DAIMYO_KOKU.toLocaleString('en-US'));
    expect(panel.textContent).toContain('daimyō');
  });

  it('D-107 Ph4 — the pre-ascension gate reads "must stand at N koku" (koku-consistent copy)', () => {
    const render = mount(root, () => {}, noopHooks());
    const value = balance.ESTATE_BANDS.good + 5; // GOOD → below the EXCELLENT gate, not ascendable
    render(liveHouse(value), null);
    openTab('家');
    const panel = root.querySelector<HTMLElement>('.influence-panel')!;
    expect(panel.textContent).toContain('must stand at');
    expect(panel.textContent).toContain(`${formatKMB(balance.ESTATE_BANDS.excellent)} koku`);
    // the old grade-noun copy is gone — the gate speaks in koku now.
    expect(panel.textContent).not.toContain('Reach Excellent standing to ascend');
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
    const btn = [...root.querySelectorAll<HTMLButtonElement>('button')].find((b) =>
      (b.textContent ?? '').includes(substr),
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
        location: 'home-paddies',
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'verb-farm', 'room-home-paddies'],
      },
      null,
    );
    expect(clickText('Work the home paddies')).toBe(true);
    expect(seen).toContainEqual({ type: 'do_activity', activityId: 'farm_paddy' });
  });

  it('a map path button dispatches move_to', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'gate-forecourt',
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'room-gate-forecourt', 'room-home-paddies'],
      },
      null,
    );
    openTab('地図');
    expect(clickText('Home paddies')).toBe(true); // the → Home paddies move
    expect(seen.some((i) => i.type === 'move_to')).toBe(true);
  });

  it('the storehouse Store button dispatches deposit (Inventory tab, only at the kura)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'kura',
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'panel-estate', 'tab-combat'], // ADR-119 — Inventory tab reveals at R3
        resources: { ...base.resources, coin: 50 },
      },
      null,
    );
    openTab('蔵'); // the kura bank is on the Inventory 蔵 tab (FB-108 / IA reorg ADR-112, revealed R3 ADR-119)
    expect(clickText('Store all coin')).toBe(true);
    expect(seen).toContainEqual({ type: 'deposit', resource: 'coin' });
  });

  it('the storehouse Store rice button dispatches deposit rice (D-107 Phase 2, at the kura)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'kura',
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'panel-estate', 'tab-combat'], // ADR-119 — Inventory tab reveals at R3
        resources: { ...base.resources, rice: 40 },
      },
      null,
    );
    openTab('蔵'); // Inventory tab (revealed R3, ADR-119)
    expect(clickText('Store all rice')).toBe(true);
    expect(seen).toContainEqual({ type: 'deposit', resource: 'rice' });
  });

  it('the market Sell-rice button dispatches sell_rice (D-107 Phase 2 — the coin faucet)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        // the gate must be open so the Map tab (the pedlar's home) is reachable.
        location: 'gate-forecourt',
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'panel-estate', 'room-gate-forecourt'],
        resources: { ...base.resources, rice: 30 },
      },
      null,
    );
    openTab('地図'); // the pedlar's market is on the Map 地図 tab now (FB-109 / IA reorg ADR-112)
    // ADR-114 — his wares open only by TALKING to him (Tokubei), never inline.
    expect(clickText('Speak with Tokubei')).toBe(true);
    expect(clickText('Sell all rice')).toBe(true);
    expect(seen).toContainEqual({ type: 'sell_rice' });
  });

  it('the Eat-plain-rice button dispatches eat_rice (D-107 Phase 2 — the rice food path)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'panel-estate', 'verb-eat-rice'],
        resources: { ...base.resources, rice: 30 },
      },
      null,
    );
    expect(clickText('Eat plain rice')).toBe(true);
    expect(seen).toContainEqual({ type: 'eat_rice' });
  });

  it('a foe Fight button dispatches fight for the foe on THIS node', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'home-paddies', // the monkey's node
        flags: { ...base.flags, awake: true, 'mob-monkey': true },
        unlocked: [...base.unlocked, 'tab-combat'],
      },
      null,
    );
    openTab('Combat');
    expect(clickText('Fight')).toBe(true);
    expect(seen.some((i) => i.type === 'fight' && i.mobId === 'monkey')).toBe(true);
  });

  it('F107 (D-112) — navigation lives ONLY on the Map tab; the Work tab has no "Walk on" strip', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'gate-forecourt',
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'room-gate-forecourt', 'room-home-paddies'],
      },
      null,
    );
    // the default Work tab carries NO move strip (FB-107 — nav's single home is Map).
    expect(root.querySelector('.actions .walk-on')).toBeNull();
    expect(root.querySelector('.actions .map-move')).toBeNull();
    // open the Map tab — the move buttons live there, and moving from Map still works.
    openTab('地図');
    const moveBtn = [...root.querySelectorAll<HTMLButtonElement>('.map-pane .map-move')].find((b) =>
      (b.textContent ?? '').includes('Home paddies'),
    );
    expect(moveBtn).toBeTruthy();
    moveBtn!.click();
    expect(seen).toContainEqual({ type: 'move_to', to: 'home-paddies' });
  });

  it('the HP "life" meter is visible once combat matters — with an exact number + a low flag (D-076)', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    const combatReady: GameState = {
      ...base,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'tab-combat'],
    };
    // hurt: HP is invisible-no-more — the number shows AND the bar flags danger.
    render({ ...combatReady, character: { ...combatReady.character, hp: 1 } }, null);
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
    expect(root.querySelector('.vital.health .bar')!.classList.contains('low')).toBe(false);
  });

  it('the Cook button becomes the PRIMARY "heal now" action when the MC is hurt (D-076 heal cue)', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    const ready: GameState = {
      ...base,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'verb-cook'],
      resources: { ...base.resources, sansai: 20 },
    };
    const cookBtn = (): HTMLButtonElement =>
      [...root.querySelectorAll<HTMLButtonElement>('button')].find((b) =>
        (b.textContent ?? '').includes('Cook a meal'),
      )!;
    // hurt → cook is emphasised (primary), the heal cue pairing with the red life bar.
    render({ ...ready, character: { ...ready.character, hp: 1 } }, null);
    expect(cookBtn().classList.contains('primary')).toBe(true);
    expect(cookBtn().title).toMatch(/only way to heal/);
    // at full HP → cook is a plain option, not shouting.
    render({ ...ready, character: { ...ready.character, hp: 9999 } }, null);
    expect(cookBtn().classList.contains('primary')).toBe(false);
  });
});

// ── ADR-119 — the seven-tab reveal CADENCE (Work R0 · Map/Estate R1 · Character R2 · Combat/Inventory
//    R3 · Quests R5). These assert the NAV chips that light at each beat, so a mis-gated tab (e.g. the
//    old Inventory-at-R1 triple-reveal, or a Quests-at-R3 batch) flips them RED. ──
describe('D-119 — tabs reveal one beat at a time (Inventory R3, Quests R5)', () => {
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
  function at(unlocked: string[]): void {
    const base = createInitialState(1);
    const render = mount(root, () => {}, noopHooks());
    render(
      { ...base, flags: { ...base.flags, awake: true }, unlocked: [...base.unlocked, ...unlocked] },
      null,
    );
  }

  it('R1 (Map+Estate live) reveals Map + Estate but NOT Inventory — no triple-reveal', () => {
    at(['room-gate-forecourt', 'panel-estate', 'panel-home']);
    const labels = tabLabels();
    expect(labels.some((l) => l.includes('地図'))).toBe(true); // Map
    expect(labels.some((l) => l.includes('家') && !l.includes('武'))).toBe(true); // Estate
    // RED against the old gate: Inventory used to light here (panel-estate/panel-home).
    expect(labels.some((l) => l.includes('Inventory'))).toBe(false);
    expect(labels.some((l) => l.includes('Quests'))).toBe(false);
  });

  it('R3 (combat live) is where the Inventory tab finally reveals', () => {
    at(['room-gate-forecourt', 'panel-estate', 'panel-home', 'tab-combat']);
    expect(tabLabels().some((l) => l.includes('Inventory'))).toBe(true);
    // …but Quests is still held for its own R5 beat, not batched into the R3 combat wave.
    expect(tabLabels().some((l) => l.includes('Quests'))).toBe(false);
  });

  it('R5 (tab-quests granted) is where the Quests tab reveals — its own beat', () => {
    at(['room-gate-forecourt', 'panel-estate', 'panel-home', 'tab-combat', 'tab-quests']);
    expect(tabLabels().some((l) => l.includes('Quests'))).toBe(true);
  });
});

// ── A7 — the staggered combat reveal + the Bestiary panel (default variant A) ────────────────
describe('A7 — combat tab reveals one beat per rung + the Bestiary fogs unfaced foes', () => {
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

  function combatState(extra: string[]): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      location: 'home-paddies',
      flags: { ...base.flags, awake: true },
      // the full R3 combat surface set: the Combat tab + its floor, plus the Character-tab surfaces
      // (tab-skills R2, readout-combat-level + panel-bestiary R3) that light the split-out sheet.
      unlocked: [
        ...base.unlocked,
        'readout-rice',
        'tab-skills',
        'readout-combat-level',
        'tab-combat',
        'panel-bestiary',
        ...extra,
      ],
    };
  }
  function openCombat(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('Combat'))!
      .click();
  }
  function openCharacter(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('己'))!
      .click();
  }

  it('R3 floor: weapon + fight show on Combat; the Bestiary SPLITS OUT to Character (D-112)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(combatState([]), null); // R3-only surfaces
    openCombat();
    const pane = root.querySelector<HTMLElement>('#pane-combat, .combat-pane') ?? root;
    // the fight floor is present on Combat
    expect(root.querySelector('.weapon-card')).not.toBeNull();
    expect(root.querySelector('.foe-row')).not.toBeNull();
    // IA reorg (ADR-112) — the Bestiary is NOT on the Combat tab anymore; it lives on Character.
    expect(root.textContent).not.toContain('Bestiary 図鑑');
    expect(root.querySelector('.character-bestiary .bestiary')).toBeNull(); // hidden while on Combat
    openCharacter();
    expect(root.textContent).toContain('Bestiary 図鑑');
    expect(root.querySelector('.character-bestiary .bestiary')).not.toBeNull();
    openCombat();
    // the R4/R5 beats are held back
    expect(pane.querySelector('.stance-row')).toBeNull();
    const blurbHasDurability = [...root.querySelectorAll('.weapon-card .skill-blurb')].some((b) =>
      (b.textContent ?? '').includes('durability'),
    );
    expect(blurbHasDurability).toBe(false);
    const repairBtn = [...root.querySelectorAll<HTMLButtonElement>('button')].find((b) =>
      (b.textContent ?? '').includes('Repair'),
    );
    expect(repairBtn).toBeUndefined();
  });

  it('R4 adds the durability read + repair (equip loop); R5 adds the stance row', () => {
    const render = mount(root, () => {}, noopHooks());
    // R4: durability + equipment + repair unlocked
    render(combatState(['readout-durability', 'panel-equipment', 'verb-repair']), null);
    openCombat();
    const durBlurb = [...root.querySelectorAll('.weapon-card .skill-blurb')].some((b) =>
      (b.textContent ?? '').includes('durability'),
    );
    expect(durBlurb).toBe(true);
    expect(root.querySelector('.stance-row')).toBeNull(); // stance still held for R5

    // R5: stance control now live
    render(
      combatState(['readout-durability', 'panel-equipment', 'verb-repair', 'stance-control']),
      null,
    );
    expect(root.querySelector('.stance-row')).not.toBeNull();
  });

  it('HD-23 (option C) — an R3 Battered blade shows the mend lock-hint; R4 swaps it for the repair CTA', () => {
    const render = mount(root, () => {}, noopHooks());
    // an R3 blade worn to Battered — `verb-repair` reveals at R4, so no mend CTA is reachable yet.
    const r3 = combatState([]);
    const weapon = getWeapon(r3.equippedWeapon);
    // derive a Battered durability from the balance source (never a copied magic number), and assert
    // the fixture really lands in the Battered band — so a bands re-tune can't silently no-op this test.
    const battered: GameState = {
      ...r3,
      weaponDurability: Math.max(1, Math.round(weapon.durabilityMax * 0.1)),
    };
    expect(durabilityBand(battered.weaponDurability, weapon.durabilityMax).name).toBe('Battered');

    render(battered, null);
    openCombat();
    const hint = root.querySelector<HTMLElement>('.weapon-card .lock-hint');
    expect(hint).not.toBeNull();
    expect(hint!.hidden).toBe(false);
    expect(hint!.textContent).toContain('mended by hands the house');
    // …and no Repair button is reachable at R3.
    const repairAtR3 = [...root.querySelectorAll<HTMLButtonElement>('button')].some(
      (b) => (b.textContent ?? '').includes('Repair') && !b.hidden,
    );
    expect(repairAtR3).toBe(false);

    // R4: `verb-repair` unlocks — the SAME worn blade now offers the real mend CTA and the hint retires.
    const r4: GameState = {
      ...battered,
      unlocked: [...battered.unlocked, 'readout-durability', 'panel-equipment', 'verb-repair'],
    };
    render(r4, battered);
    const hintR4 = root.querySelector<HTMLElement>('.weapon-card .lock-hint');
    expect(hintR4 === null || hintR4.hidden).toBe(true);
    const repairAtR4 = [...root.querySelectorAll<HTMLButtonElement>('button')].some(
      (b) => (b.textContent ?? '').includes('Repair') && !b.hidden,
    );
    expect(repairAtR4).toBe(true);
  });

  it('the Bestiary (on Character) fogs an unfaced foe, then inks its entry once its mob-<id> is set', () => {
    const render = mount(root, () => {}, noopHooks());
    const state = combatState([]);
    render(state, null);
    openCharacter(); // the bestiary lives on the Character 己 tab (IA reorg ADR-112)
    // no foe faced → the bestiary cards read as fogged silhouettes
    const cards = [...root.querySelectorAll<HTMLElement>('.bestiary-card')];
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((c) => (c.textContent ?? '').includes('Unknown foe'))).toBe(true);
    expect(root.textContent).toContain('Not yet faced');

    // face the monkey → its card inks in with a real win-% and its kanji, others stay fogged.
    const seen = setFlag(state, 'mob-monkey');
    render(seen, state);
    const inked = [...root.querySelectorAll<HTMLElement>('.bestiary-card')].find((c) =>
      (c.textContent ?? '').includes('Crop-raiding monkey'),
    );
    expect(inked).toBeTruthy();
    expect(inked!.textContent).toContain('%');
    expect(inked!.textContent).toContain('Tell —');
  });
});

// ── HD-24 — the cold-open "restore a save" affordance (import before replaying the intro) ──
describe('HD-24 (option B) — cold-open offers a quiet restore-a-save line', () => {
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

  it('the pre-awake card shows a Restore line that opens the Saves modal over the cold-open', () => {
    const render = mount(root, () => {}, noopHooks());
    render(createInitialState(1), null); // no `awake` flag → the cold-open card is shown
    const restore = root.querySelector<HTMLButtonElement>('.coldopen-restore');
    expect(restore).not.toBeNull();

    const scrim = root.querySelector<HTMLElement>('.modal-scrim');
    expect(scrim).not.toBeNull();
    // the modal is a ROOT-level sibling (not nested in the pre-awake-`hidden` shell), so it can
    // overlay the cold-open — the crux of HD-24.
    expect(scrim!.parentElement).toBe(root);
    expect(scrim!.hidden).toBe(true); // closed until asked

    restore!.click();
    expect(scrim!.hidden).toBe(false); // the restore line opens it…
    // …straight onto the Saves tab (the import textarea's section is the active one).
    const savesTab = [...root.querySelectorAll<HTMLButtonElement>('.modal-tab')].find((b) =>
      (b.textContent ?? '').includes('Saves'),
    );
    expect(savesTab?.getAttribute('aria-selected')).toBe('true');
  });
});

// ── FB-62 — the two-column VN intro modal: ask → done → decide gating + choose → reply → Continue ──
// (MODE==='test' → the typewriter is instant, so the panel + transcript render synchronously.)
describe('F62/F81 — the interactive intro VN scene (append-only, two columns)', () => {
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

  // an intro-active state (awake so render shows the VN scene, not the cold-open) parked at `beat`.
  function introState(beat: number, askedTopics: string[] = []): GameState {
    const base = createInitialState(1);
    return { ...base, introBeat: beat, askedTopics, flags: { ...base.flags, awake: true } };
  }
  function spyMount(): { seen: Intent[]; render: ReturnType<typeof mount> } {
    const seen: Intent[] = [];
    return { seen, render: mount(root, (i) => seen.push(i), noopHooks()) };
  }
  const byText = (sel: string, substr: string): HTMLButtonElement | undefined =>
    [...root.querySelectorAll<HTMLButtonElement>(sel)].find((b) =>
      (b.textContent ?? '').includes(substr),
    );
  // a sub-panel counts as SHOWN only when it exists and isn't hidden (the panel is a stable region
  // whose sub-panels toggle `hidden` in place — FB-79, never removed from the DOM).
  const shown = (sel: string): boolean => {
    const e = root.querySelector<HTMLElement>(sel);
    return !!e && !e.hidden;
  };

  it('renders TWO columns; Phase 1 shows the ask hub, the decide grid stays hidden', () => {
    const { render } = spyMount();
    render(introState(0), null);
    expect(root.querySelector('.vn-body')).not.toBeNull();
    expect(root.querySelector('.vn-story .vn-lines')).not.toBeNull();
    expect(root.querySelector('.vn-panel')).not.toBeNull();
    // the greeting typed into the story; the ASK sub-panel is shown, the DECIDE sub-panel is hidden.
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain('Sōan');
    expect(root.querySelectorAll('.intro-ask').length).toBe(DIALOGUE_SCENES[0]!.topics.length);
    expect(shown('.vn-ask')).toBe(true);
    expect(shown('.vn-decide')).toBe(false); // the decision is withheld in the ask phase
    expect(root.querySelector('.intro-done')).not.toBeNull();
  });

  it('"I\'ve heard enough" swaps to the DECIDE grid WITHOUT recreating the story nodes (F81)', () => {
    const { render } = spyMount();
    render(introState(0), null);
    // capture the first already-rendered greeting line to prove it is NOT destroyed on the swap.
    const firstLine = root.querySelector<HTMLElement>('.vn-story .vn-line')!;
    expect(firstLine).not.toBeNull();
    root.querySelector<HTMLButtonElement>('.intro-done')!.click();
    // the SAME node persists (append-only — no teardown/innerHTML reset ⇒ no flash).
    expect(firstLine.isConnected).toBe(true);
    expect(root.querySelector('.vn-story .vn-line')).toBe(firstLine);
    // the panel swapped IN PLACE: decide shown, ask hidden (both still in the DOM).
    expect(shown('.vn-decide')).toBe(true);
    expect(shown('.vn-ask')).toBe(false);
    expect(root.querySelectorAll('.intro-choice').length).toBe(
      DIALOGUE_SCENES[0]!.decision.options.length,
    );
    // the decision prompt joined the story transcript (so it, too, is typed — FB-82/FB-83).
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      DIALOGUE_SCENES[0]!.decision.prompt,
    );
  });

  it('an asked Q/A APPENDS to the story, leaving prior lines untouched (append-only diff)', () => {
    const { render } = spyMount();
    const topic = DIALOGUE_SCENES[0]!.topics[0]!;
    render(introState(0), null);
    const greetingLines = root.querySelectorAll('.vn-story .vn-line').length;
    const firstLine = root.querySelector<HTMLElement>('.vn-story .vn-line')!;
    // simulate the core having recorded the ask (askedTopics grows) + a re-render.
    render(introState(0, [topic.id]), null);
    expect(firstLine.isConnected).toBe(true); // the greeting node was NOT recreated
    const lines = root.querySelectorAll('.vn-story .vn-line');
    expect(lines.length).toBeGreaterThan(greetingLines); // the Q + answer appended
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(topic.label);
  });

  it('each decision button is THEMED by the attribute it grants +1 (accent + kanji chip)', () => {
    const { render } = spyMount();
    render(introState(0), null);
    const opt = DIALOGUE_SCENES[0]!.decision.options[0]!; // soan-grateful → +INT
    const btn = byText('.intro-choice', opt.label)!;
    expect(btn).toBeTruthy();
    expect(btn.style.getPropertyValue('--attr-accent')).toContain(`attr-${opt.stat.up}`);
    const chip = btn.querySelector<HTMLElement>('.intro-choice-tag')!;
    expect(chip).not.toBeNull();
    expect(chip.textContent).toBe(ATTR_META[opt.stat.up].kanji);
  });

  it('picking a choice does NOT advance — reply + fresh divider + perk + Continue appear', () => {
    const { seen, render } = spyMount();
    render(introState(0), null);
    root.querySelector<HTMLButtonElement>('.intro-done')!.click();
    const opt = DIALOGUE_SCENES[0]!.decision.options[0]!;
    byText('.intro-choice', opt.label)!.click();
    // the KEY complaint fix: picking never dispatches choose_intro (no scene jump yet).
    expect(seen.some((i) => i.type === 'choose_intro')).toBe(false);
    // the chosen reply (what the CHARACTER said back) appended to the story…
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      opt.react.slice(1, 20),
    );
    // …under the SAME fade-away fresh-entries divider the main log uses (FB-76)…
    expect(root.querySelector('.vn-story .log-fresh-divider')).not.toBeNull();
    // …the granted perk shows as an attribute-themed box, and the outcome panel is shown…
    const perk = root.querySelector<HTMLElement>('.perk-box')!;
    expect(perk).not.toBeNull();
    expect(perk.textContent).toContain(opt.perk.name);
    expect(perk.classList.contains('attr-themed')).toBe(true);
    expect(root.querySelector('.perk-attr-chip')!.textContent).toBe(ATTR_META[opt.stat.up].kanji);
    expect(shown('.vn-outcome')).toBe(true);
    expect(shown('.vn-decide')).toBe(false);
    // …and a single Continue is the ONLY way onward.
    expect(root.querySelector('.intro-continue')).not.toBeNull();
  });

  it('ONLY Continue dispatches choose_intro (advancing the scene)', () => {
    const { seen, render } = spyMount();
    render(introState(0), null);
    root.querySelector<HTMLButtonElement>('.intro-done')!.click();
    const opt = DIALOGUE_SCENES[0]!.decision.options[0]!;
    byText('.intro-choice', opt.label)!.click();
    root.querySelector<HTMLButtonElement>('.intro-continue')!.click();
    expect(seen).toContainEqual({ type: 'choose_intro', optionId: opt.id });
  });

  it('a decision-only scene (the dream — no topics) opens straight in the DECIDE grid', () => {
    const dreamIdx = DIALOGUE_SCENES.findIndex((s) => s.topics.length === 0);
    expect(dreamIdx).toBeGreaterThanOrEqual(0);
    const { render } = spyMount();
    render(introState(dreamIdx), null);
    expect(shown('.vn-decide')).toBe(true);
    expect(root.querySelector('.vn-choices.vn-grid')).not.toBeNull();
    expect(root.querySelector('.intro-ask')).toBeNull(); // no ask hub for a topic-less scene
    expect(root.querySelector('.intro-done')).toBeNull();
    // the prompt still types into the story on entry (nothing pops in un-typed — FB-82/FB-83).
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      DIALOGUE_SCENES[dreamIdx]!.decision.prompt,
    );
  });

  // FB-88 — EVERY voiced line carries its speaker-name prefix, not just the player's. The NPC greeting
  // (a non-player line) must render "<name>: " the same way the player's "You: " does.
  it('F88 — a voiced NPC greeting line renders its speaker-name prefix, not just player lines', () => {
    const { render } = spyMount();
    render(introState(0), null);
    // the scene's first VOICED greeting line (narrator lines carry no speaker → no prefix, by design).
    const npcName = DIALOGUE_SCENES[0]!.greeting.find((l) => l.speaker)!.speaker; // from the scene
    expect(npcName).toBeTruthy();
    const prefixes = [...root.querySelectorAll<HTMLElement>('.vn-line .vn-speaker')].map(
      (s) => s.textContent,
    );
    // the NPC's own name prefixes its line (RED before FB-88 — NPC lines had no .vn-speaker span).
    expect(prefixes).toContain(`${npcName}: `);
  });

  // FB-87 — an asked topic keeps the `asked` class (the hook the gray styling hangs on). Re-askable
  // (still a live button), just de-emphasized in CSS.
  it('F87 — an asked topic button carries the gray "asked" class', () => {
    const { render } = spyMount();
    const topic = DIALOGUE_SCENES[0]!.topics[0]!;
    render(introState(0, [topic.id]), null);
    const btn = [...root.querySelectorAll<HTMLButtonElement>('.intro-ask')].find((b) =>
      (b.textContent ?? '').includes(topic.label),
    )!;
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('asked')).toBe(true);
  });
});

// ── ADR-110 / FB-106 — the rung-up STORY BEAT is REACHABLE: the header rung element is the player-
//    triggered start, the beat plays in the SAME full-screen VN scene as the intro (vnActive), and a
//    ready promotion is IGNORABLE (it banks; the grind never forces the modal). Reuses the intro's
//    append-only VN engine (§7.3) — the rung options ride the same latch → Continue → dispatch path. ──
describe('D-110 / F106 — rung-up story beats are reachable (header trigger + VN reuse)', () => {
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
    return { seen, render: mount(root, (i) => seen.push(i), noopHooks()) };
  }
  const byText = (sel: string, substr: string): HTMLButtonElement | undefined =>
    [...root.querySelectorAll<HTMLButtonElement>(sel)].find((b) =>
      (b.textContent ?? '').includes(substr),
    );
  const shown = (sel: string): boolean => {
    const e = root.querySelector<HTMLElement>(sel);
    return !!e && !e.hidden;
  };
  const INTRO_DONE = DIALOGUE_SCENES.length; // introBeat past the last scene ⇒ introActive false
  // an out-of-intro, awake, "the-ladder-is-meaningful" (raked) base — the header rung shows here.
  function awakeRungBase(): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      introBeat: INTRO_DONE,
      flags: { ...base.flags, awake: true, raked: true },
    };
  }
  // a state parked at R0 with the meter PAST the R0→R1 threshold (source-of-truth: rungThreshold),
  // R0's storyGate being always-true ⇒ promotionReady. rungBeat stays null (the promotion BANKS).
  function rungReadyState(): GameState {
    return { ...awakeRungBase(), rungMeter: balance.rungThreshold('R0') + 10 };
  }
  // a state parked INSIDE a live rung beat (the player already triggered it).
  function rungBeatState(target: 'R1' | 'R3', askedTopics: string[] = []): GameState {
    return { ...awakeRungBase(), rungBeat: target, askedTopics };
  }

  it('a READY promotion turns the header rung into a begin_rung_beat trigger', () => {
    const { seen, render } = spyMount();
    const state = rungReadyState();
    expect(promotionReady(state)).toBe(true); // fixture self-check (derived, not a magic number)
    render(state, null);
    const trigger = root.querySelector<HTMLButtonElement>('.rung-head-trigger')!;
    expect(trigger).not.toBeNull();
    expect(root.querySelector('.rung-head')!.classList.contains('ready')).toBe(true);
    expect(trigger.disabled).toBe(false); // clickable ONLY when ready
    trigger.click();
    expect(seen).toContainEqual({ type: 'begin_rung_beat' });
  });

  it('the TERMINAL rung (R7) with a full meter does NOT light a dead trigger', () => {
    // R7 is the top of T0: its meter keeps refilling and its storyGate is always-true, so
    // promotionReady stays true — but there is NO next rank, so the header must NOT offer a
    // begin_rung_beat that would no-op (the deploy-gate audit caught this as a phantom capstone
    // button). RED against the pre-fix header, which lit `.ready` whenever promotionReady held.
    const { seen, render } = spyMount();
    const state: GameState = {
      ...awakeRungBase(),
      rung: 'R7',
      rungMeter: balance.rungThreshold('R7') + 10,
    };
    expect(promotionReady(state)).toBe(true); // the meter IS full + the gate open…
    expect(nextRankId(state.rung)).toBeNull(); // …but there is no rung to advance to
    render(state, null);
    expect(root.querySelector('.rung-head')!.classList.contains('ready')).toBe(false); // no glow
    const trigger = root.querySelector<HTMLButtonElement>('.rung-head-trigger')!;
    expect(trigger.disabled).toBe(true);
    trigger.click();
    expect(seen).not.toContainEqual({ type: 'begin_rung_beat' }); // clicking does nothing
  });

  it('the header rung shows the rung name, a meter bar, and a hover detail card (not-ready)', () => {
    const { render } = spyMount();
    const state: GameState = { ...awakeRungBase(), rungMeter: 40 }; // mid-climb, NOT ready
    expect(promotionReady(state)).toBe(false);
    render(state, null);
    const head = root.querySelector<HTMLElement>('.rung-head')!;
    expect(head.hidden).toBe(false);
    expect(head.classList.contains('ready')).toBe(false);
    expect(root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.disabled).toBe(true);
    const rank = getRank('R0');
    const name = root.querySelector<HTMLElement>('.rung-head-name')!.textContent ?? '';
    expect(name).toContain(rank.title);
    expect(name).toContain(rank.kanji);
    expect(root.querySelector('.rung-head-meter > span')).not.toBeNull();
    // the hover card carries the meter numbers + names the NEXT rung.
    expect(root.querySelector('.rung-head-card-meter')!.textContent).toContain(
      String(balance.rungThreshold('R0')),
    );
    const next = getRank(nextRankId('R0')!); // → R1
    expect(root.querySelector('.rung-head-card-next')!.textContent).toContain(next.title);
  });

  it('with rungBeat set the VN scene renders the rung beat and HIDES the shell (vnActive)', () => {
    const { render } = spyMount();
    render(rungBeatState('R1'), null);
    // the full-screen washi scene is up (the SAME .vn-scene as the intro)…
    expect(root.querySelector('.vn-scene')).not.toBeNull();
    // …and it hides the shell (the vnActive gate now covers a rung beat too).
    expect(root.querySelector<HTMLElement>('.shell')!.hidden).toBe(true);
    // R1 is a light-VN (topics: []) → opens straight in the DECIDE grid, with the rung's options.
    expect(shown('.vn-decide')).toBe(true);
    expect(root.querySelectorAll('.intro-choice').length).toBe(
      RUNG_BEATS.R1!.decision.options.length,
    );
    // the greeting prose typed into the story (the beat is the story surface, FB-103).
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      RUNG_BEATS.R1!.greeting[0]!.text.slice(0, 24),
    );
  });

  it('a full VN meet (R3 Kihei) shows the ask-hub; asking dispatches ask_rung_topic', () => {
    const { seen, render } = spyMount();
    render(rungBeatState('R3'), null);
    expect(shown('.vn-ask')).toBe(true);
    // only the un-gated topics are askable at zero-asked (kihei-who gates behind kihei-why-blade).
    const askable = RUNG_BEATS.R3!.topics.filter((t) => !t.gate || t.gate(new Set<string>()));
    expect(askable.length).toBeGreaterThan(0);
    expect(root.querySelectorAll('.intro-ask').length).toBe(askable.length);
    const topic = askable[0]!;
    byText('.intro-ask', topic.label)!.click();
    expect(seen).toContainEqual({ type: 'ask_rung_topic', topicId: topic.id });
  });

  it('picking a rung option latches; ONLY Continue dispatches choose_rung_option', () => {
    const { seen, render } = spyMount();
    render(rungBeatState('R1'), null);
    const opt = RUNG_BEATS.R1!.decision.options[0]!;
    byText('.intro-choice', opt.label)!.click();
    // latching alone does NOT advance (no promotion yet) — mirrors the intro's FB-62 fix.
    expect(seen.some((i) => i.type === 'choose_rung_option')).toBe(false);
    // the chosen reply appended to the story + a single Continue is the only way onward…
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      opt.react.slice(1, 20),
    );
    root.querySelector<HTMLButtonElement>('.intro-continue')!.click();
    expect(seen).toContainEqual({ type: 'choose_rung_option', optionId: opt.id });
  });

  it('ignoring a ready promotion leaves the game playable (the beat is IGNORABLE, D-110)', () => {
    const { seen, render } = spyMount();
    render(rungReadyState(), null);
    // nothing auto-fired the beat — a ready promotion BANKS on the header, never forces the modal.
    expect(seen.some((i) => i.type === 'begin_rung_beat')).toBe(false);
    // the shell is SHOWN (no full-screen VN scene blocks play) …
    expect(root.querySelector<HTMLElement>('.shell')!.hidden).toBe(false);
    expect(root.querySelector('.vn-scene')).toBeNull();
    // … the affordance sits ready-but-optional (the player may keep grinding indefinitely).
    expect(root.querySelector('.rung-head')!.classList.contains('ready')).toBe(true);
    expect(root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.disabled).toBe(false);
  });
});

// ── FB-86/FB-90 — the intro typewriter under the ANIMATED path (MODE!=='test', motion allowed): lines
//    AUTO-advance (a click only speeds up), and an idle re-render of settled state mutates nothing. ──
describe('F86/F90 — intro typewriter auto-advance + flicker-free reconcile (animated)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    // motion ALLOWED (matches:false) — so the renderer takes the real typewriter path, not instant.
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
    vi.stubEnv('MODE', 'development'); // leave the MODE==='test' instant fast-path
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });
  function introState(beat: number, askedTopics: string[] = []): GameState {
    const base = createInitialState(1);
    return { ...base, introBeat: beat, askedTopics, flags: { ...base.flags, awake: true } };
  }
  function spyMount(): ReturnType<typeof mount> {
    return mount(root, () => {}, noopHooks());
  }
  const lineTexts = (): (string | null)[] =>
    [...root.querySelectorAll<HTMLElement>('.vn-line .vn-text')].map((e) => e.textContent);
  const shown = (sel: string): boolean => {
    const e = root.querySelector<HTMLElement>(sel);
    return !!e && !e.hidden;
  };

  // FB-86 — the core fix: with NO click at all, the block types line 0, then AUTO-advances (the ~2s
  // timer) into each subsequent line to the end, and reveals the panel. RED before FB-86: a finished
  // non-last line just paused, so line 1+ never typed without a click.
  it('F86 — lines auto-advance through the whole block with NO click, then reveal the panel', () => {
    const render = spyMount();
    render(introState(0), null);
    const greeting = DIALOGUE_SCENES[0]!.greeting;
    expect(greeting.length).toBeGreaterThanOrEqual(2);
    vi.runAllTimers(); // let ONLY the auto timers run — no click
    const texts = lineTexts();
    greeting.forEach((line, i) => expect(texts[i]).toBe(line.text)); // every line typed itself
    expect(shown('.vn-ask')).toBe(true); // …and the panel revealed after the last line
  });

  // FB-86 — a click while a line is still typing COMPLETES it instantly (speeds up); it never pauses.
  it('F86 — a click mid-type completes the current line instantly', () => {
    const render = spyMount();
    render(introState(0), null);
    const full = DIALOGUE_SCENES[0]!.greeting[0]!.text;
    const first = root.querySelector<HTMLElement>('.vn-line .vn-text')!;
    expect(first.textContent).not.toBe(full); // mid-type (the first char timer hasn't even fired)
    root.querySelector<HTMLElement>('.vn-scene')!.click();
    expect(first.textContent).toBe(full); // the click filled the line at once
  });

  // FB-86 — a click DURING the ~2s inter-line hold skips the remaining wait and starts the next line
  // now. RED against a model that ignores the click in the gap (line 1 would stay empty until ~2s).
  it('F86 — a click during the inter-line hold advances immediately (skips the wait)', () => {
    const render = spyMount();
    render(introState(0), null);
    const sceneEl = root.querySelector<HTMLElement>('.vn-scene')!;
    sceneEl.click(); // complete line 0 → arm the hold
    expect(lineTexts()[1]).toBe(''); // line 1 waiting out the hold
    sceneEl.click(); // click in the gap → skip the wait, start line 1 now
    vi.advanceTimersByTime(100); // a fraction of the ~2s hold — enough for a few chars if it started
    expect((lineTexts()[1] ?? '').length).toBeGreaterThan(0); // it started early, not at ~2s
  });

  // FB-90 — the flicker guard: once the block has typed out and the panel is revealed, re-rendering
  // the SAME intro state (as the tick loop does) must not touch the scene DOM — no re-added fade
  // class, no re-typed text, no re-hidden/re-shown panel. A DOM mutation here is a visible flicker.
  it('F90 — an idle re-render of settled intro state mutates nothing in the scene', () => {
    const render = spyMount();
    render(introState(0), null);
    vi.runAllTimers(); // settle: greeting fully typed, ask panel revealed
    const sceneEl = root.querySelector<HTMLElement>('.vn-scene')!;
    const before = sceneEl.innerHTML;
    const obs = new MutationObserver(() => {});
    obs.observe(sceneEl, { childList: true, subtree: true, attributes: true });
    render(introState(0), null); // identical-state re-render ticks
    render(introState(0), null);
    render(introState(0), null);
    const records = obs.takeRecords(); // synchronously drain any queued mutations
    obs.disconnect();
    expect(records).toEqual([]); // zero DOM mutations ⇒ nothing can re-animate ⇒ no flicker
    expect(sceneEl.innerHTML).toBe(before);
  });
});

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

  function awake(extraUnlocked: string[] = []): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, ...extraUnlocked],
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

  it('locks byōbu folding-columns + soft cards as the sole prod rendering (no DEV toggle)', () => {
    const render = mount(root, () => {}, noopHooks()); // no dev harness = the prod path
    render(awake(), null);
    const ws = root.querySelector<HTMLElement>('.workspace')!;
    expect(ws.dataset.layout).toBe('layout-byobu');
    expect(ws.dataset.framing).toBe('framing-cards');
    expect(root.querySelector<HTMLElement>('.shell')!.dataset.layout).toBe('layout-byobu');
  });

  it('F77 — a new log line pins the reader to the newest entry (sticky-bottom)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s0 = logged([narr(0, 'The rice is spilled.'), narr(1, 'You take up the rake.')]);
    render(s0, null);
    const lines = root.querySelector<HTMLElement>('.log-lines')!;
    Object.defineProperty(lines, 'scrollHeight', { configurable: true, value: 500 });
    Object.defineProperty(lines, 'clientHeight', { configurable: true, value: 100 });
    const s1 = logged([...s0.log.entries, narr(2, 'Another line arrives.')]);
    render(s1, s0);
    expect(lines.scrollTop).toBe(500); // followed the newest line to the foot
  });

  it('F77 — a reader scrolled UP into history is NOT yanked to the bottom', () => {
    const render = mount(root, () => {}, noopHooks());
    const s0 = logged([narr(0, 'a'), narr(1, 'b')]);
    render(s0, null);
    const lines = root.querySelector<HTMLElement>('.log-lines')!;
    Object.defineProperty(lines, 'scrollHeight', { configurable: true, value: 500 });
    Object.defineProperty(lines, 'clientHeight', { configurable: true, value: 100 });
    lines.scrollTop = 0; // the reader scrolled up to read old lines…
    lines.dispatchEvent(new Event('scroll')); // …which un-pins them from the foot
    const s1 = logged([...s0.log.entries, narr(2, 'c')]);
    render(s1, s0);
    expect(lines.scrollTop).toBe(0); // left where they were, not yanked down
  });

  it('F67/F72 — the pedlar buy control sits in its OWN in-flow cell (never a floating overlap)', () => {
    const render = mount(root, () => {}, noopHooks());
    // stand at the forecourt so the pedlar (Tokubei) is actually present to talk to.
    render({ ...awake(['panel-estate', 'room-gate-forecourt']), location: 'gate-forecourt' }, null);
    // the pedlar's market is on the Map 地図 tab now (FB-109 / IA reorg ADR-112).
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('地図'))
      ?.click();
    // ADR-114 — talk to Tokubei to open his wares (talk-to-reveal, never inline).
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((b) => (b.textContent ?? '').includes('Speak with Tokubei'))
      ?.click();
    const rows = [...root.querySelectorAll<HTMLElement>('.market-pane .market-row')];
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
        ...awake(['panel-rung-ladder']),
        flags: { ...createInitialState(1).flags, awake: true, raked: true },
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
    render(awake(['panel-estate', 'room-gate-forecourt', 'panel-rung-ladder']), null);
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
    render(awake(['panel-estate', 'room-gate-forecourt']), null);
    const estatePane = root.querySelector<HTMLElement>('.estate-pane')!;
    // structural: it's grouped in the Do slice, NOT the Work-column Estate/economy slice.
    expect(root.querySelector('.slice-do .estate-pane')).not.toBeNull();
    expect(root.querySelector('.slice-estate .estate-pane')).toBeNull();
    // on the default Work tab the estate-improve card is hidden (no empty ghost in the Work column).
    expect(estatePane.hidden).toBe(true);
    // switch to the Estate (家) tab → the estate-improve card renders there (the Map 地図 tab is the
    // node-map now, a separate tab — proving the improve card is NOT on Map).
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('地図'))
      ?.click();
    expect(estatePane.hidden).toBe(true); // NOT on the Map tab
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('家'))
      ?.click();
    expect(estatePane.hidden).toBe(false);
    expect(estatePane.textContent ?? '').toContain('Estate ·');
  });
});

// ── FB-74 — the per-log font stepper (log-scoped scale, persisted) ─────────────────────────────────
describe('F74 — per-log font stepper scales the log text + persists', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear(); // the persisted scale must not leak between cases
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

  function awake(): GameState {
    const base = createInitialState(1);
    return { ...base, flags: { ...base.flags, awake: true } };
  }
  const stepper = () => ({
    minus: root.querySelector<HTMLButtonElement>('.log-font-btn[aria-label="Smaller log text"]')!,
    plus: root.querySelector<HTMLButtonElement>('.log-font-btn[aria-label="Larger log text"]')!,
    logScaleVar: () =>
      root.querySelector<HTMLElement>('.slice-log')!.style.getPropertyValue('--log-scale'),
  });

  it('renders the A− / A+ steppers inside the log filter bar', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const bar = root.querySelector<HTMLElement>('.log-filter-bar')!;
    const grp = bar.querySelector<HTMLElement>('.log-font-stepper')!;
    expect(grp).not.toBeNull(); // lives in the filter bar, bottom-right of the log
    expect(grp.querySelectorAll('.log-font-btn').length).toBe(2);
  });

  it('A+ raises and A− lowers the log-scoped --log-scale (a scoped var, not global chrome)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const { minus, plus, logScaleVar } = stepper();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_DEFAULT, 5); // starts at the default

    plus.click();
    const raised = Number(logScaleVar());
    expect(raised).toBeCloseTo(LOG_SCALE_DEFAULT + LOG_SCALE_STEP, 5);

    minus.click();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_DEFAULT, 5);
  });

  it('disables A− at the floor and A+ at the ceiling (bound affordance)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const { minus, plus, logScaleVar } = stepper();

    // step DOWN past the floor — A− must end disabled and the var pinned to the min
    for (let i = 0; i < 20; i++) minus.click();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_MIN, 5);
    expect(minus.disabled).toBe(true);
    expect(plus.disabled).toBe(false);

    // step UP past the ceiling — A+ must end disabled and the var pinned to the max
    for (let i = 0; i < 40; i++) plus.click();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_MAX, 5);
    expect(plus.disabled).toBe(true);
    expect(minus.disabled).toBe(false);
  });

  it('persists the choice (localStorage) and re-applies it on a fresh mount', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    stepper().plus.click();
    stepper().plus.click(); // +2 steps from the default

    // a brand-new mount (fresh renderer) must read the persisted scale back, not reset to default
    document.body.innerHTML = '';
    root = document.createElement('div');
    document.body.append(root);
    const render2 = mount(root, () => {}, noopHooks());
    render2(awake(), null);
    expect(Number(stepper().logScaleVar())).toBeCloseTo(LOG_SCALE_DEFAULT + 2 * LOG_SCALE_STEP, 5);
  });
});

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

  function awake(extraUnlocked: string[] = [], over: Partial<GameState> = {}): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, ...extraUnlocked],
      ...over,
    };
  }
  function openTab(marker: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes(marker))
      ?.click();
  }
  // ADR-114 — talk to Tokubei on the Map's who's-here list to open his wares (talk-to-reveal).
  function talkToPedlar(): void {
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((b) => (b.textContent ?? '').includes('Speak with Tokubei'))
      ?.click();
  }
  // observe a settled surface across an identical-state re-render; return the queued mutations.
  function churnOnReRender(
    el: HTMLElement,
    state: GameState,
    render: ReturnType<typeof mount>,
  ): MutationRecord[] {
    const obs = new MutationObserver(() => {});
    obs.observe(el, { childList: true, subtree: true, attributes: true, characterData: true });
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
    const s = awake([], { flags: { ...createInitialState(1).flags, awake: true, raked: true } });
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
    const s = awake(['panel-estate', 'room-gate-forecourt'], { location: 'gate-forecourt' }); // the pedlar is on the Map tab now
    render(s, null);
    openTab('地図');
    talkToPedlar();
    const row = root.querySelector<HTMLElement>('.market-pane .market-row')!;
    const btn = row.querySelector<HTMLButtonElement>('.market-buy button')!;
    expect(row).not.toBeNull();
    render(s, s);
    expect(root.querySelector('.market-pane .market-row')).toBe(row); // reused
    expect(row.querySelector('.market-buy button')).toBe(btn); // the click-bound button survives
    expect(row.isConnected).toBe(true);
    expect(churnOnReRender(root.querySelector<HTMLElement>('.market-pane')!, s, render)).toEqual(
      [],
    );
  });

  it('renderMarket — a patch reflects a changed buy state without recreating the row', () => {
    const seen: Intent[] = [];
    const render = mount(root, (i) => seen.push(i), noopHooks());
    const s = awake(['panel-estate', 'room-gate-forecourt'], {
      location: 'gate-forecourt',
      resources: { ...createInitialState(1).resources, coin: 0 },
    });
    render(s, null);
    openTab('地図'); // the pedlar's market is on the Map tab now
    talkToPedlar(); // ADR-114 — open his wares by talking (never inline)
    const row = root.querySelector<HTMLElement>('.market-pane .market-row')!;
    const btn = row.querySelector<HTMLButtonElement>('.market-buy button')!;
    expect(btn.disabled).toBe(true); // no coin → can't buy
    // afford it → the SAME button becomes enabled (patched in place, not a fresh node).
    const rich = awake(['panel-estate', 'room-gate-forecourt'], {
      location: 'gate-forecourt',
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
    // tab-skills open but no skill has any XP yet → the skills pane renders ZERO cards.
    // readout-combat-level gives the Character tab OTHER content (the training/attrs section) so the
    // tab reveals while skills is genuinely empty — the exact FB-72 ghost-box case (a shown-but-empty
    // SECTION inside a non-empty tab). (ADR-119 — quests moved to their own tab, so they no longer keep
    // Character non-empty here.)
    const s = awake(['tab-skills', 'readout-combat-level']);
    render(s, null);
    openTab('己'); // skills is a section of the Character 己 tab now (IA reorg ADR-112)
    expect(root.querySelector('.skills-pane .skill-row')).toBeNull();
    // FB-72 ghost-box: a shown-but-empty pane leaves NO element children (no orphan keeps a slice up).
    expect(root.querySelector<HTMLElement>('.skills-pane')!.childElementCount).toBe(0);

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
      churnOnReRender(root.querySelector<HTMLElement>('.skills-pane')!, withSkill, render),
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
    expect(churnOnReRender(root.querySelector<HTMLElement>('.quests-pane')!, s, render)).toEqual(
      [],
    );
  });

  it('renderStorehouse — the kura card survives a re-render; idle ticks churn nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['panel-estate', 'tab-combat'], { location: 'kura' }); // ADR-119 — Inventory reveals R3
    render(s, null);
    openTab('蔵'); // the kura bank is on the Inventory 蔵 tab now (FB-108 / IA reorg ADR-112)
    const card = root.querySelector<HTMLElement>('.storehouse-pane .rung-card')!;
    expect(card).not.toBeNull();
    render(s, s);
    expect(root.querySelector('.storehouse-pane .rung-card')).toBe(card);
    expect(
      churnOnReRender(root.querySelector<HTMLElement>('.storehouse-pane')!, s, render),
    ).toEqual([]);
  });

  it('renderEstate — the improve card survives a re-render (Estate tab); rooms grow, not rebuild', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['panel-estate', 'room-gate-forecourt']);
    render(s, null);
    openTab('家'); // IA reorg (ADR-112) — the estate-improve card lives on the Estate 家 tab now
    const card = root.querySelector<HTMLElement>('.estate-pane .rung-card')!;
    expect(card.textContent).toContain('Estate ·');
    render(s, s);
    expect(root.querySelector('.estate-pane .rung-card')).toBe(card); // reused
    expect(churnOnReRender(root.querySelector<HTMLElement>('.estate-pane')!, s, render)).toEqual(
      [],
    );
  });

  it('renderNowView — a fleeting Now line survives a re-render; idle ticks churn nothing (D-123)', () => {
    // ADR-123 closes the last wholesale-rebuild surface: the Now view now RECONCILES its ephemeral
    // lines instead of `textContent=''` + rebuild. RED against the old rebuild — every idle tick
    // recreated the node (churn) and dropped its identity.
    const render = mount(root, () => {}, noopHooks());
    let s = awake(['room-gate-forecourt', 'room-home-paddies'], { location: 'gate-forecourt' });
    // a move emits an EPHEMERAL arrival line (the sole feed of the Now view).
    s = reduce(s, { type: 'move_to', to: 'home-paddies' });
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

  it('renderMap — the you-are-here card survives a re-render (identity; moveStrip is Phase 2)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['room-gate-forecourt', 'room-home-paddies'], { location: 'gate-forecourt' });
    render(s, null);
    openTab('地図');
    const card = root.querySelector<HTMLElement>('.map-pane .map-here')!;
    const blurb = card.querySelector<HTMLElement>('.skill-blurb')!;
    const move = root.querySelector<HTMLElement>('.map-pane .map-move')!;
    expect(card).not.toBeNull();
    render(s, s);
    // the CARD frame + its header/blurb persist — and now (Phase 2) the move strip is zero-churn too:
    // the same move button survives an idle re-render (patchStrip only swaps it when it changes).
    expect(root.querySelector('.map-pane .map-here')).toBe(card);
    expect(card.querySelector('.skill-blurb')).toBe(blurb);
    expect(root.querySelector('.map-pane .map-move')).toBe(move);
    expect(card.isConnected).toBe(true);
    expect(churnOnReRender(root.querySelector<HTMLElement>('.map-pane')!, s, render)).toEqual([]);
  });
});

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

  function awake(extraUnlocked: string[] = [], over: Partial<GameState> = {}): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, ...extraUnlocked],
      ...over,
    };
  }
  function combat(extra: string[] = [], over: Partial<GameState> = {}): GameState {
    return awake(['tab-combat', 'panel-bestiary', ...extra], { location: 'home-paddies', ...over });
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
    obs.observe(el, { childList: true, subtree: true, attributes: true, characterData: true });
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
    const s = awake(['verb-farm', 'room-home-paddies', 'room-gate-forecourt'], {
      location: 'home-paddies',
      autoActivity: 'farm_paddy',
    });
    render(s, null);
    const actions = root.querySelector<HTMLElement>('.actions')!;
    const labourBtn = [...actions.querySelectorAll<HTMLButtonElement>('.area-group .verb')].find(
      (b) => (b.textContent ?? '').includes('Work the home paddies'),
    )!;
    const auto = actions.querySelector<HTMLButtonElement>('.area-group .auto-toggle')!;
    expect(auto).not.toBeNull();
    expect(auto.classList.contains('on')).toBe(true); // the auto-labour is running
    // the Work tab holds no nav strip anymore (FB-107) — its sole home is Map.
    expect(actions.querySelector('.walk-on')).toBeNull();
    render(s, s);
    // every node the player can touch is REUSED, not rebuilt (focus + auto-run survive).
    expect(
      [...actions.querySelectorAll<HTMLButtonElement>('.area-group .verb')].find((b) =>
        (b.textContent ?? '').includes('Work the home paddies'),
      ),
    ).toBe(labourBtn);
    expect(actions.querySelector('.area-group .auto-toggle')).toBe(auto);
    expect(auto.isConnected).toBe(true);
    expect(churnOnReRender(actions, s, render)).toEqual([]);
  });

  it('renderActions — toggling auto-labour patches the SAME toggle node in place (no re-create)', () => {
    const seen: Intent[] = [];
    const render = mount(root, (i) => seen.push(i), noopHooks());
    const off = awake(['verb-farm', 'room-home-paddies'], { location: 'home-paddies' });
    render(off, null);
    const auto = root.querySelector<HTMLButtonElement>('.actions .area-group .auto-toggle')!;
    expect(auto.classList.contains('on')).toBe(false);
    // start the auto-labour → the SAME node flips `.on` (patched, not remounted); its listener holds.
    const on = awake(['verb-farm', 'room-home-paddies'], {
      location: 'home-paddies',
      autoActivity: 'farm_paddy',
    });
    render(on, off);
    expect(root.querySelector('.actions .area-group .auto-toggle')).toBe(auto);
    expect(auto.classList.contains('on')).toBe(true);
    auto.click();
    expect(seen.some((i) => i.type === 'set_auto')).toBe(true);
  });

  it('renderCombat — the XP card + a foe-watch row survive a re-render; idle churns nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = combat();
    render(s, null);
    openTab('Combat');
    const pane = root.querySelector<HTMLElement>('.combat-pane')!;
    const xp = pane.querySelector<HTMLElement>('.rung-card')!;
    const foe = pane.querySelector<HTMLElement>('.foe-row:not(.bestiary-card)')!;
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
    const s = combat(); // the monkey stands unseen (fogged)
    render(s, null);
    openTab('Combat');
    const pane = root.querySelector<HTMLElement>('.combat-pane')!;
    const foe = pane.querySelector<HTMLElement>('.foe-row:not(.bestiary-card)')!;
    const wr = foe.querySelector<HTMLElement>('.win-rate')!;
    expect(foe.querySelector('.skill-name')!.textContent).toBe('Unknown foe');
    expect(wr.textContent).toContain('Unknown');
    // face the monkey → the SAME row + the SAME win-rate node patch to a real forecast (no strobe).
    const facedIt = setFlag(s, 'mob-monkey');
    render(facedIt, s);
    expect(pane.querySelector('.foe-row:not(.bestiary-card)')).toBe(foe); // row not recreated
    expect(foe.querySelector('.win-rate')).toBe(wr); // forecast pip patched in place
    expect(foe.querySelector('.skill-name')!.textContent).not.toBe('Unknown foe');
    expect(wr.textContent).toContain('%');
  });
});

// ── Phase B (ADR-114 vendors-as-people + ADR-116 location flavor) — the pedlar (Tokubei) is a talkable
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

  function awakeAt(location: string, extraUnlocked: string[] = []): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      location,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, ...extraUnlocked],
    };
  }
  function openTab(marker: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes(marker))
      ?.click();
  }
  function clickButton(substr: string): boolean {
    const btn = [...root.querySelectorAll<HTMLButtonElement>('button')].find((b) =>
      (b.textContent ?? '').includes(substr),
    );
    btn?.click();
    return Boolean(btn);
  }

  it('the Map "who\'s here" lists the pedlar (Tokubei) at his node — a talk affordance', () => {
    const render = mount(root, () => {}, noopHooks());
    const pedlar = getPerson('pedlar'); // source of truth: his node + name
    render(awakeAt(pedlar.node, ['room-gate-forecourt', 'panel-estate']), null);
    openTab('地図');
    const whos = root.querySelector<HTMLElement>('.map-pane .whos-here')!;
    expect(whos).not.toBeNull();
    expect(whos.hidden).toBe(false);
    const rows = [...root.querySelectorAll<HTMLElement>('.map-pane .person-row')];
    expect(rows.some((r) => (r.textContent ?? '').includes(pedlar.name))).toBe(true);
    // …and a Speak affordance for him (talk-to-reveal — his shop is not dumped inline).
    expect(
      [...root.querySelectorAll<HTMLButtonElement>('.map-pane .person-talk')].some((b) =>
        (b.textContent ?? '').includes(`Speak with ${pedlar.name}`),
      ),
    ).toBe(true);
  });

  it('talking to the pedlar OPENS his wares — the shop is hidden until you speak to him', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awakeAt('gate-forecourt', ['room-gate-forecourt', 'panel-estate']), null);
    openTab('地図');
    // BEFORE talking: the pedlar's wares are NOT rendered inline on the Map tab.
    expect(root.querySelector('.market-pane .market-row')).toBeNull();
    expect(root.querySelector<HTMLElement>('.market-pane')!.hidden).toBe(true);
    // talk → the trade panel opens (his MARKET_ITEMS rows + the sell-rice faucet).
    expect(clickButton('Speak with Tokubei')).toBe(true);
    expect(root.querySelector<HTMLElement>('.market-pane')!.hidden).toBe(false);
    expect(root.querySelectorAll('.market-pane .market-row').length).toBeGreaterThan(0);
  });

  it("the pedlar's shop is NEVER inline on the Work tab (talk-to-reveal only)", () => {
    const render = mount(root, () => {}, noopHooks());
    // awake at the forecourt with the economy open, sitting on the default Work tab.
    render(awakeAt('gate-forecourt', ['room-gate-forecourt', 'panel-estate']), null);
    // no wares are built on Work, and the market pane is hidden there.
    expect(root.querySelector('.market-pane .market-row')).toBeNull();
    expect(root.querySelector<HTMLElement>('.market-pane')!.hidden).toBe(true);
    // there is no who's-here / person list on the Work tab either (nav's people live on Map).
    expect(root.querySelector('.actions .person-row')).toBeNull();
  });

  it("the place-gated smith appears in who's-here only AFTER his place is unlocked (D-114)", () => {
    const render = mount(root, () => {}, noopHooks());
    const smith = getPerson('smith');
    const gate = smith.placeGate!; // source of truth for the gate + node
    // at his node before the smithy is yours → no smith row.
    render(awakeAt(smith.node, ['room-gate-forecourt', 'room-woodlot-edge']), null);
    openTab('地図');
    expect(
      [...root.querySelectorAll<HTMLElement>('.map-pane .person-row')].some((r) =>
        (r.textContent ?? '').includes(smith.name),
      ),
    ).toBe(false);
    // unlock the place → the smith joins the who's-here list.
    render(awakeAt(smith.node, ['room-gate-forecourt', 'room-woodlot-edge', gate]), null);
    expect(
      [...root.querySelectorAll<HTMLElement>('.map-pane .person-row')].some((r) =>
        (r.textContent ?? '').includes(smith.name),
      ),
    ).toBe(true);
  });

  it("D-116 — a move's arrival flavor is a transient Now line, NOT a permanent Story line", () => {
    const render = mount(root, () => {}, noopHooks());
    const dest = 'gate-forecourt';
    const s0 = awakeAt('kura', [getNode(dest).revealFlag!]);
    const moved = reduce(s0, { type: 'move_to', to: dest }); // walk to the forecourt
    render(moved, s0);
    const blurb = getNode(dest).blurb;
    const lines = root.querySelector<HTMLElement>('.log-lines')!;
    // the default Story view holds only mandatory beats — the nav flavor is absent.
    expect(lines.textContent ?? '').not.toContain(blurb);
    // switch to the Now view → the fleeting arrival line surfaces there (and fades on its own).
    [...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab')]
      .find((b) => (b.textContent ?? '') === 'Now')
      ?.click();
    const nowLines = [...root.querySelectorAll<HTMLElement>('.log-lines .now-line')];
    expect(nowLines.some((l) => (l.textContent ?? '').includes(blurb))).toBe(true);
  });
});

// FB-102 / ADR-115 / ADR-116 — the Map splits into (a) a bordered you-are-here FLAVOR card and (b) a
// terse, HINT-FREE navigation section. You move by CLICKING a road (no separate "go" button), and
// no unvisited node leaks a loot/foe/reward hint (the flavor updates on ARRIVAL). The prod DEFAULT
// (map-a) is the terse paths list — these tests drive the SHIPPED path (no DEV harness).
describe('Estate map — flavor + terse hint-free navigation (F102, prod default)', () => {
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
  function at(location: string, extra: string[] = []): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      location,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, ...extra],
    };
  }
  function spyRender(): { seen: Intent[]; render: ReturnType<typeof mount> } {
    const seen: Intent[] = [];
    return { seen, render: mount(root, (i) => seen.push(i), noopHooks()) };
  }

  it('renders the flavor card (current-node blurb) + a SEPARATE terse nav; a road click walks there', () => {
    const { seen, render } = spyRender();
    render(at('gate-forecourt', ['room-gate-forecourt', 'room-home-paddies']), null);
    openMapTab();
    const flavor = root.querySelector<HTMLElement>('.map-pane .map-here')!;
    const nav = root.querySelector<HTMLElement>('.map-pane .map-nav')!;
    expect(flavor).not.toBeNull();
    expect(nav).not.toBeNull();
    // (a) the flavor carries the CURRENT node's immersive description…
    expect(flavor.textContent).toContain(getNode('gate-forecourt').blurb);
    // …and (b) the nav is a SIBLING section, not nested inside the flavor card.
    expect(flavor.contains(nav)).toBe(false);
    // click-to-move: a terse road button walks there (reuses move_to; no separate go button).
    const road = nav.querySelector<HTMLButtonElement>('.map-move[data-node="home-paddies"]')!;
    expect(road).not.toBeNull();
    road.click();
    expect(seen).toContainEqual({ type: 'move_to', to: 'home-paddies' });
  });

  it('the nav gives NO next-zone hint — no destination blurb, no loot/foe preview', () => {
    const { render } = spyRender();
    render(at('gate-forecourt', ['room-gate-forecourt', 'room-home-paddies']), null);
    openMapTab();
    const text = root.querySelector<HTMLElement>('.map-pane .map-nav')!.textContent ?? '';
    // the destination's blurb never leaks into navigation (it updates on ARRIVAL, ADR-116)…
    expect(text).not.toContain(getNode('home-paddies').blurb);
    // …and there is no loot/foe preview of the next zone (the old default tagged yields + "a foe stirs").
    expect(text).not.toContain('rice');
    expect(text).not.toContain('a foe stirs');
  });

  it('a conditioning-locked road is shown GREYED + disabled with its reason (not hidden)', () => {
    const { render } = spyRender();
    render(
      at('home-paddies', ['room-home-paddies', 'room-gate-forecourt', 'room-near-satoyama']),
      null,
    );
    openMapTab();
    const nav = root.querySelector<HTMLElement>('.map-pane .map-nav')!;
    const locked = nav.querySelector<HTMLButtonElement>('.map-move[data-node="near-satoyama"]')!;
    expect(locked).not.toBeNull();
    expect(locked.disabled).toBe(true);
    expect(locked.dataset.locked).toBe('1');
    // the reason is VISIBLE (a lock-hint beneath it), never a dead grey box.
    expect(nav.textContent).toContain(`Needs Conditioning Lv${balance.CONDITIONING_GATE_LEVEL}`);
  });
});

// ── FB-111 · the "Chat" log tab — the OPTIONAL Q&A you chose to ask, split off from the MANDATORY
//    Story. A chat line is `narration` + `chat:true`; the filter routes it to Chat (+ All), never
//    Story. FB-104/FB-105 · the footer version is clickable → the About modal, which deep-links the raw
//    CHANGELOG on GitHub. FB-115 · the Now expiry runs on wall time regardless of the active view. ──
describe('F111 / F104 / F105 / F115 — log/UI polish batch', () => {
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

  function awake(): GameState {
    const base = createInitialState(1);
    return { ...base, flags: { ...base.flags, awake: true } };
  }
  function logged(entries: LogEntry[]): GameState {
    return { ...awake(), log: { entries, seq: entries.length } };
  }
  function clickFilter(label: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab')]
      .find((b) => (b.textContent ?? '') === label)
      ?.click();
  }
  const logText = (): string => root.querySelector<HTMLElement>('.log-lines')!.textContent ?? '';

  // a MANDATORY story beat (narration, no chat flag) vs an OPTIONAL asked question (narration +
  // chat:true) — the exact split ask_topic/ask_rung_topic produce (they flag their lines `chat`).
  const MANDATORY = 'The physician studies your face in the lamplight.';
  const ASKED = 'Who found me on the mountain road?';
  function withChatAndStory(): GameState {
    return logged([
      { key: 0, channel: 'narration', text: MANDATORY, tick: 0, count: 1 },
      { key: 1, channel: 'narration', text: ASKED, tick: 0, count: 1, chat: true },
    ]);
  }

  it('F111 — a mandatory beat shows in Story; the asked question is withheld from Story', () => {
    const render = mount(root, () => {}, noopHooks());
    render(withChatAndStory(), null); // opens on Story (the default)
    expect(logText()).toContain(MANDATORY);
    expect(logText()).not.toContain(ASKED); // the optional Q&A is NOT mandatory story
  });

  it('F111 — the Chat tab holds the asked question, NOT the mandatory beat', () => {
    const render = mount(root, () => {}, noopHooks());
    render(withChatAndStory(), null);
    // Chat sits in the bar (order: Story · Progress · Chat · Combat · Work · All · Now)…
    const chatTab = [...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab')].find(
      (b) => (b.textContent ?? '') === 'Chat',
    );
    expect(chatTab).toBeTruthy();
    clickFilter('Chat');
    expect(logText()).toContain(ASKED); // the optional Q&A lives here…
    expect(logText()).not.toContain(MANDATORY); // …and the mandatory beat does not leak in
  });

  it('F111 — an asked ask_topic line is flagged chat in the pure core (routing source of truth)', () => {
    // drive the REAL reducer: ask the first intro topic, and prove the emitted lines carry `chat`.
    let s: GameState = { ...awake(), introBeat: 0 };
    const topic = DIALOGUE_SCENES[0]!.topics[0]!;
    s = reduce(s, { type: 'ask_topic', topicId: topic.id });
    const asked = s.log.entries.filter((e) => e.text === topic.label);
    expect(asked.length).toBeGreaterThan(0);
    // the player's question + the NPC's answer are ALL chat (they route to Chat, off Story).
    for (const e of s.log.entries.filter((e) => e.chat)) expect(e.channel).toBe('narration');
    expect(asked.every((e) => e.chat === true)).toBe(true);
  });

  it('F104 — the footer version is clickable → opens the About modal (single-sourced version)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const ver = root.querySelector<HTMLButtonElement>('.appbar-footer .foot-version')!;
    expect(ver).not.toBeNull();
    // single-sourced from __VERSION__ (package.json), never hand-typed (AC-21).
    expect(ver.textContent).toBe(__VERSION__);
    const scrim = root.querySelector<HTMLElement>('.modal-scrim')!;
    expect(scrim.hidden).toBe(true); // closed to start
    ver.click();
    expect(scrim.hidden).toBe(false); // …the modal opened…
    // …straight on the About tab, whose panel carries the single-sourced version.
    expect(root.querySelector<HTMLElement>('.modal-tab.active')!.textContent).toBe('About');
    const shownSection = [...root.querySelectorAll<HTMLElement>('.modal-section')].find(
      (s) => !s.hidden,
    )!;
    expect(shownSection.textContent).toContain(__VERSION__);
  });

  it('F105 — the About modal deep-links to the raw CHANGELOG on GitHub (opens in a new tab)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    root.querySelector<HTMLButtonElement>('.appbar-footer .foot-version')!.click();
    const link = root.querySelector<HTMLAnchorElement>('.modal-link')!;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe(
      'https://raw.githubusercontent.com/Raynos/kami-kakushi/main/CHANGELOG.md',
    );
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener'); // new-tab safety
  });

  // a single fleeting entry: `narration` + `ephemeral:true` (a rest / move-arrival flavor line).
  function withEphemeral(): GameState {
    return logged([
      {
        key: 0,
        channel: 'narration',
        text: 'A cold gust crosses the yard.',
        tick: 0,
        count: 1,
        ephemeral: true,
      },
    ]);
  }

  it('F115 — a Now entry expires on wall-clock even while Now is NOT the active view', () => {
    vi.useFakeTimers();
    try {
      const render = mount(root, () => {}, noopHooks());
      // render on the Story tab (default) — the ephemeral line is stamped the moment it's SEEN,
      // and its expiry clock ticks regardless of which tab is showing (FB-115).
      render(withEphemeral(), null);
      // wait out the TTL (derived from the SAME source the renderer uses) WHILE still on Story…
      vi.advanceTimersByTime(NOW_TTL_MS + 2000);
      // …then open Now: the line already aged out (the OLD view-coupled timer would show it FRESH).
      clickFilter('Now');
      expect(root.querySelectorAll('.log-lines .now-line').length).toBe(0);
      // the calm placeholder stands in — the tab never reads broken.
      expect(root.querySelector('.log-lines .log-empty')).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('F115 — a still-fresh Now entry DOES surface when Now opens (the clock is real, not a sink)', () => {
    vi.useFakeTimers();
    try {
      const render = mount(root, () => {}, noopHooks());
      render(withEphemeral(), null);
      vi.advanceTimersByTime(1000); // well within the TTL — still alive
      clickFilter('Now');
      const nowLines = [...root.querySelectorAll<HTMLElement>('.log-lines .now-line')];
      expect(nowLines.length).toBe(1);
      expect(nowLines[0]!.textContent).toContain('A cold gust crosses the yard.');
    } finally {
      vi.useRealTimers();
    }
  });
});

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
  // REVEALED. ADR-111 timing moved to R3 (human 2026-07-03) — panel-home now gates on tab-combat, the
  // same R3 surface as its tab, so the home is announced exactly when its tab appears.
  function homeState(extra?: Partial<GameState>): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      flags: { ...s.flags, awake: true, raked: true, 'rank-r1': true },
      unlocked: [
        ...s.unlocked,
        'readout-rice',
        'room-gate-forecourt',
        'room-home-paddies',
        'panel-rung-ladder',
        'panel-estate',
        'panel-home',
        'tab-combat', // ADR-119 — the Inventory tab reveals at R3; without it the tab won't appear
      ],
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

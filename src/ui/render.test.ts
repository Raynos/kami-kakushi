// @vitest-environment jsdom
//
// The feel-pass (Commit 8) render assertions: the pure ×N log formatter, the
// unknown-foe fog gating, and the settings-modal a11y (textarea labels + Tab
// focus-trap). DOM tests mount the real renderer and drive it like the app does.
import { describe, it, expect, beforeEach } from 'vitest';
import { mount, formatLogText, type AppHooks } from './render';
import {
  createInitialState,
  foesHere,
  setFlag,
  balance,
  type GameState,
  type Intent,
  type LogEntry,
} from '../core';

function entry(text: string, count: number, channel: LogEntry['channel'] = 'reward'): LogEntry {
  return { key: 0, channel, text, tick: 0, count };
}

describe('formatLogText — coalesced ×N display', () => {
  it('leaves a single (count 1) line untouched', () => {
    expect(formatLogText(entry('You fell the crop-raiding monkey. (+3 koku)', 1))).toBe(
      'You fell the crop-raiding monkey. (+3 koku)',
    );
  });

  it('multiplies a single-resource suffix into a running total', () => {
    expect(formatLogText(entry('You fell the crop-raiding monkey. (+3 koku)', 12))).toBe(
      'You fell the crop-raiding monkey. ×12 (+36 koku)',
    );
    expect(formatLogText(entry('Work the home paddies. (+4 koku)', 7))).toBe(
      'Work the home paddies. ×7 (+28 koku)',
    );
  });

  it('never multiplies a multi-resource suffix (bare ×N fallback)', () => {
    expect(formatLogText(entry('Forage the near satoyama. (+2 sansai, +1 koku)', 5))).toBe(
      'Forage the near satoyama. (+2 sansai, +1 koku) ×5',
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
      unlocked: [...s.unlocked, 'panel-house-influence'],
      influence: { estate: { value: excellent, highWater: excellent, judged: 0 } },
      character: { ...s.character, attributePoints: 5 },
    };
    render(ascended, null); // 'work' is the default active tab — the influence panel is live here

    const panel = root.querySelector<HTMLElement>('.influence-panel')!;
    expect(panel).toBeTruthy();
    // the AFTER of the payoff: a resolved next-state, the boon prompt — and NOT the 480/480 bug.
    expect(panel.textContent).toContain('man of the house');
    expect(panel.textContent).toContain('Risen');
    expect(panel.textContent).toContain('5 points'); // the lord's boon, waiting to be spent
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

  it('the storehouse Store button dispatches deposit (only rendered at the kura)', () => {
    const { seen, render } = spyMount();
    const base = createInitialState(1);
    render(
      {
        ...base,
        location: 'kura',
        flags: { ...base.flags, awake: true },
        unlocked: [...base.unlocked, 'panel-estate'],
        resources: { ...base.resources, koku: 50 },
      },
      null,
    );
    expect(clickText('Store all koku')).toBe(true);
    expect(seen).toContainEqual({ type: 'deposit', resource: 'koku' });
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

  it('the Work-tab "Walk on" strip moves you without a tab-switch (smooth spatial loop)', () => {
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
    // NO tab switch — the default Work tab carries a "Walk on" move strip.
    const walkOn = root.querySelector('.actions .walk-on');
    expect(walkOn).not.toBeNull();
    const moveBtn = [...root.querySelectorAll<HTMLButtonElement>('.actions .map-move')].find((b) =>
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
      unlocked: [...base.unlocked, 'readout-rice', 'tab-combat', 'panel-bestiary', ...extra],
    };
  }
  function openCombat(): void {
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('Combat'))!
      .click();
  }

  it('R3 floor: weapon + fight + Bestiary show, but NOT durability text, repair, equip, or stance', () => {
    const render = mount(root, () => {}, noopHooks());
    render(combatState([]), null); // R3-only surfaces
    openCombat();
    const pane = root.querySelector<HTMLElement>('#pane-combat, .combat-pane') ?? root;
    // the fight floor is present
    expect(root.querySelector('.weapon-card')).not.toBeNull();
    expect(root.querySelector('.foe-row')).not.toBeNull();
    expect(root.textContent).toContain('Bestiary 図鑑');
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

  it('the Bestiary fogs an unfaced foe, then inks its entry once its mob-<id> is set', () => {
    const render = mount(root, () => {}, noopHooks());
    const state = combatState([]);
    render(state, null);
    openCombat();
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

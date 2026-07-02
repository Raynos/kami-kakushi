// @vitest-environment jsdom
//
// The feel-pass (Commit 8) render assertions: the pure ×N log formatter, the
// unknown-foe fog gating, and the settings-modal a11y (textarea labels + Tab
// focus-trap). DOM tests mount the real renderer and drive it like the app does.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, formatLogText, type AppHooks } from './render';
import { LOG_SCALE_MIN, LOG_SCALE_MAX, LOG_SCALE_STEP, LOG_SCALE_DEFAULT } from './ui-prefs';
import {
  createInitialState,
  foesHere,
  setFlag,
  balance,
  DIALOGUE_SCENES,
  ATTR_META,
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

// ── F62 — the two-column VN intro modal: ask → done → decide gating + choose → reply → Continue ──
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
  // whose sub-panels toggle `hidden` in place — F79, never removed from the DOM).
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
    // the decision prompt joined the story transcript (so it, too, is typed — F82/F83).
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
    // …under the SAME fade-away fresh-entries divider the main log uses (F76)…
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
    // the prompt still types into the story on entry (nothing pops in un-typed — F82/F83).
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      DIALOGUE_SCENES[dreamIdx]!.decision.prompt,
    );
  });

  // F88 — EVERY voiced line carries its speaker-name prefix, not just the player's. The NPC greeting
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
    // the NPC's own name prefixes its line (RED before F88 — NPC lines had no .vn-speaker span).
    expect(prefixes).toContain(`${npcName}: `);
  });

  // F87 — an asked topic keeps the `asked` class (the hook the gray styling hangs on). Re-askable
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

// ── F86/F90 — the intro typewriter under the ANIMATED path (MODE!=='test', motion allowed): lines
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

  // F86 — the core fix: with NO click at all, the block types line 0, then AUTO-advances (the ~2s
  // timer) into each subsequent line to the end, and reveals the panel. RED before F86: a finished
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

  // F86 — a click while a line is still typing COMPLETES it instantly (speeds up); it never pauses.
  it('F86 — a click mid-type completes the current line instantly', () => {
    const render = spyMount();
    render(introState(0), null);
    const full = DIALOGUE_SCENES[0]!.greeting[0]!.text;
    const first = root.querySelector<HTMLElement>('.vn-line .vn-text')!;
    expect(first.textContent).not.toBe(full); // mid-type (the first char timer hasn't even fired)
    root.querySelector<HTMLElement>('.vn-scene')!.click();
    expect(first.textContent).toBe(full); // the click filled the line at once
  });

  // F86 — a click DURING the ~2s inter-line hold skips the remaining wait and starts the next line
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

  // F90 — the flicker guard: once the block has typed out and the panel is revealed, re-rendering
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
    render(awake(['panel-estate']), null);
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

  it('F72 — an empty rung ladder collapses its Progress slice, never an empty framed ghost card', () => {
    const render = mount(root, () => {}, noopHooks());
    // awake but not yet raked and the rung-ladder panel not unlocked → the ladder has nothing to show.
    render(awake(), null);
    expect(root.querySelector<HTMLElement>('.ladder')!.hidden).toBe(true);
    expect(root.querySelector<HTMLElement>('.slice-progress')!.hidden).toBe(true);
  });

  it('F94 — the work slices are direct children of the .work fold (the flex-0 stacking seam)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(['panel-estate', 'room-gate-forecourt', 'panel-rung-ladder']), null);
    const work = root.querySelector<HTMLElement>('.work')!;
    // The F94 fix (`.workspace[data-layout=layout-byobu] > .work > .slice { flex: 0 0 auto }`) can
    // only reach the slices if they are DIRECT children of `.work` — nest them deeper and the cards
    // squeeze/overlap again. Guard that seam structurally.
    for (const cls of ['slice-do', 'slice-progress', 'slice-estate']) {
      const slice = root.querySelector<HTMLElement>(`.${cls}`)!;
      expect(slice).not.toBeNull();
      expect(slice.parentElement).toBe(work);
    }
  });

  it('F100 — the estate-improve card lives on the Estate tab, not the Work tab', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(['panel-estate', 'room-gate-forecourt']), null);
    const estatePane = root.querySelector<HTMLElement>('.estate-pane')!;
    // structural: it's grouped in the Do slice (its home is the Estate/map tab), NOT the
    // Work-column Estate/economy slice — so moving it can't leave a ghost in the Work fold.
    expect(root.querySelector('.slice-do .estate-pane')).not.toBeNull();
    expect(root.querySelector('.slice-estate .estate-pane')).toBeNull();
    // on the default Work tab the estate-improve card is hidden (no empty ghost in the Work column).
    expect(estatePane.hidden).toBe(true);
    // switch to the Estate (地図) tab → the estate-improve card renders there.
    [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')]
      .find((b) => (b.textContent ?? '').includes('地図'))
      ?.click();
    expect(estatePane.hidden).toBe(false);
    expect(estatePane.textContent ?? '').toContain('Estate ·');
  });
});

// ── F74 — the per-log font stepper (log-scoped scale, persisted) ─────────────────────────────────
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
//    block (`F81`). MODE==='test' keeps the renderer synchronous. ─────────────────────────────────
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

  it('renderLadder — the rung card + meter fill survive a re-render (identity + width persists)', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake([], { flags: { ...createInitialState(1).flags, awake: true, raked: true } });
    render(s, null);
    const card = root.querySelector<HTMLElement>('.ladder .rung-card')!;
    const fill = root.querySelector<HTMLElement>('.ladder .meter span')!;
    expect(card).not.toBeNull();
    const width0 = fill.style.width;
    render(s, s);
    expect(root.querySelector('.ladder .rung-card')).toBe(card); // same node, not rebuilt
    expect(root.querySelector('.ladder .meter span')).toBe(fill); // same fill ⇒ transition survives
    expect(fill.style.width).toBe(width0);
    expect(card.isConnected).toBe(true);
    expect(churnOnReRender(root.querySelector<HTMLElement>('.ladder')!, s, render)).toEqual([]);
  });

  it('renderMarket — a pedlar row survives a re-render (identity) and idle ticks churn nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = awake(['panel-estate']);
    render(s, null);
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
    const s = awake(['panel-estate'], {
      resources: { ...createInitialState(1).resources, koku: 0 },
    });
    render(s, null);
    const row = root.querySelector<HTMLElement>('.market-pane .market-row')!;
    const btn = row.querySelector<HTMLButtonElement>('.market-buy button')!;
    expect(btn.disabled).toBe(true); // no koku → can't buy
    // afford it → the SAME button becomes enabled (patched in place, not a fresh node).
    const rich = awake(['panel-estate'], {
      resources: { ...createInitialState(1).resources, koku: 9999 },
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
    const s = awake(['tab-skills']);
    render(s, null);
    openTab('技');
    expect(root.querySelector('.skills-pane .skill-row')).toBeNull();
    // F72 ghost-box: a shown-but-empty pane leaves NO element children (no orphan keeps a slice up).
    expect(root.querySelector<HTMLElement>('.skills-pane')!.childElementCount).toBe(0);

    // give farming enough XP to surface its skill card, then prove identity across a tick.
    const withSkill = awake(['tab-skills'], {
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
    const s = awake(['tab-combat']); // quests open with combat
    render(s, null);
    openTab('用');
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
    const s = awake(['panel-estate'], { location: 'kura' });
    render(s, null);
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
    openTab('地図');
    const card = root.querySelector<HTMLElement>('.estate-pane .rung-card')!;
    expect(card.textContent).toContain('Estate ·');
    render(s, s);
    expect(root.querySelector('.estate-pane .rung-card')).toBe(card); // reused
    expect(churnOnReRender(root.querySelector<HTMLElement>('.estate-pane')!, s, render)).toEqual(
      [],
    );
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

  it('renderActions — the labour row + its auto-toggle + the walk-on strip survive; idle churns nothing', () => {
    const render = mount(root, () => {}, noopHooks());
    // a labour node WITH the walk-on strip open + an auto-labour running (the auto-toggle the player
    // is watching must not re-create / lose focus on the ~2×/s tick).
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
    const walkMove = actions.querySelector<HTMLElement>('.walk-on .map-move')!;
    expect(auto).not.toBeNull();
    expect(auto.classList.contains('on')).toBe(true); // the auto-labour is running
    expect(walkMove).not.toBeNull();
    render(s, s);
    // every node the player can touch is REUSED, not rebuilt (focus + auto-run survive).
    expect(
      [...actions.querySelectorAll<HTMLButtonElement>('.area-group .verb')].find((b) =>
        (b.textContent ?? '').includes('Work the home paddies'),
      ),
    ).toBe(labourBtn);
    expect(actions.querySelector('.area-group .auto-toggle')).toBe(auto);
    expect(actions.querySelector('.walk-on .map-move')).toBe(walkMove); // strip not re-mounted
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

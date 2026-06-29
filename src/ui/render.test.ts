// @vitest-environment jsdom
//
// The feel-pass (Commit 8) render assertions: the pure ×N log formatter, the
// unknown-foe fog gating, and the settings-modal a11y (textarea labels + Tab
// focus-trap). DOM tests mount the real renderer and drive it like the app does.
import { describe, it, expect, beforeEach } from 'vitest';
import { mount, formatLogText, type AppHooks } from './render';
import { createInitialState, foeForecasts, setFlag, type GameState, type LogEntry } from '../core';

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

    // mark the first grindable foe as encountered → its row now shows a real %.
    const firstMob = foeForecasts(state)[0]!.mob.id;
    const seenState = setFlag(state, `mob-${firstMob}`);
    render(seenState, state);

    const seenRow = root.querySelector<HTMLElement>('.foe-row')!;
    const seenWr = seenRow.querySelector('.win-rate')!;
    expect(seenWr.querySelector('.pip.unknown')).toBeNull();
    expect(seenWr.textContent).toContain('%');
  });
});

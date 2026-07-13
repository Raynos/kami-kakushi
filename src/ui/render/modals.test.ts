// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '../render';
import {
  createInitialState,
  reduce,
  DIALOGUE_SCENES,
  RUNG_BEATS,
  type GameState,
  rungRequirements,
} from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { noopHooks } from './test-utils';

// ── SLOP threshold gates (human, 2026-07-10) — crossing R0→R1 warns "unreviewed",
//    R1→R2 warns "untested" with typed consent on Confirm; both close the house way
//    (× / Escape); a live rung-up VN plays out before the warning; a DEV teleport
//    (no player-initiated arming click) never trips either. Each test drives the
//    REAL reducer to the promotion and the REAL mounted DOM through the render diff. ──
describe('SLOP threshold gates — R0→R1 confirm, R1→R2 typed consent, DEV teleports exempt', () => {
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
  const INTRO_DONE = DIALOGUE_SCENES.length;
  const doneReqs = (rung: GameState['rung']): Record<string, number> =>
    Object.fromEntries(
      rungRequirements(rung).map((r) => [r.id, r.type === 'count' ? r.target : 1]),
    );
  /** An out-of-intro state parked at `rung` with its requirement list DONE (registry-derived). */
  function readyAt(rung: GameState['rung']): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      rung,
      introBeat: INTRO_DONE,
      flags: { ...base.flags, awake: true, raked: true },
      rungReqs: doneReqs(rung),
    };
  }
  /** Promote through the REAL reducer path: trigger the beat; play its decision if one exists. */
  function promote(ready: GameState): GameState {
    let s = reduce(ready, { type: 'begin_rung_beat' });
    if (s.rungBeat !== null) {
      const opt = RUNG_BEATS[s.rungBeat]!.decision.options[0]!;
      s = reduce(s, { type: 'choose_rung_option', optionId: opt.id });
    }
    return s;
  }

  it('R0→R1 (player-armed): the slop warning interposes; Confirm clears it', () => {
    const render = mount(root, () => {}, noopHooks());
    const ready = readyAt('R0');
    render(ready, null);
    root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.click(); // arms the gate
    const promoted = promote(ready);
    expect(promoted.rung).toBe('R1'); // fixture self-check
    render(promoted, ready);
    const scrim = root.querySelector<HTMLElement>('.slop-scrim')!;
    expect(scrim).not.toBeNull();
    expect(scrim.textContent).toContain('unreviewed');
    const confirm = scrim.querySelector<HTMLButtonElement>('.slop-confirm')!;
    expect(confirm.disabled).toBe(false); // R1 is confirm-only — no typed consent
    confirm.click();
    expect(root.querySelector('.slop-scrim')).toBeNull();
  });

  it('R0→R1: × and Escape close the warning the house way (human follow-up)', () => {
    const render = mount(root, () => {}, noopHooks());
    const ready = readyAt('R0');
    render(ready, null);
    root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.click();
    render(promote(ready), ready);
    // × closes…
    root.querySelector<HTMLButtonElement>('.slop-scrim .modal-close')!.click();
    expect(root.querySelector('.slop-scrim')).toBeNull();
    // …and Escape closes (fresh mount — the armed latch was consumed above)
    document.body.innerHTML = '';
    root = document.createElement('div');
    document.body.append(root);
    const render2 = mount(root, () => {}, noopHooks());
    render2(ready, null);
    root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.click();
    render2(promote(ready), ready);
    expect(root.querySelector('.slop-scrim')).not.toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(root.querySelector('.slop-scrim')).toBeNull();
  });

  it('R1→R2: the warning WAITS for the rung-up VN, then demands the typed sentence', () => {
    const render = mount(root, () => {}, noopHooks());
    const ready = readyAt('R1');
    render(ready, null);
    root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.click(); // arms the gate
    const promoted = promote(ready);
    expect(promoted.rung).toBe('R2'); // ADR-165: the silent rung promotes straight through
    expect(promoted.sceneQueue.length).toBeGreaterThan(0); // the yard-hand scene queued
    render(promoted, ready);
    // the story plays FIRST: no warning while a VN scene is queued/live (human follow-up)
    expect(root.querySelector('.slop-scrim')).toBeNull();
    // the scene has closed — the held warning now opens on the shell
    const settled: GameState = { ...promoted, sceneQueue: [] };
    render(settled, promoted);
    const scrim = root.querySelector<HTMLElement>('.slop-scrim')!;
    expect(scrim).not.toBeNull();
    expect(scrim.textContent).toContain('untested');
    const confirm = scrim.querySelector<HTMLButtonElement>('.slop-confirm')!;
    const input = scrim.querySelector<HTMLInputElement>('.slop-input')!;
    expect(confirm.disabled).toBe(true); // locked until the sentence lands
    input.value = 'let me in';
    input.dispatchEvent(new Event('input'));
    expect(confirm.disabled).toBe(true); // a partial phrase stays locked
    input.value = 'Yes I really want to play the vibe slop let me in.';
    input.dispatchEvent(new Event('input'));
    expect(confirm.disabled).toBe(false);
    confirm.click();
    expect(root.querySelector('.slop-scrim')).toBeNull();
  });

  it('an UNARMED rung commit (a __qa.toRung-style teleport) never trips the gate', () => {
    const render = mount(root, () => {}, noopHooks());
    const ready = readyAt('R0');
    render(ready, null);
    // NO trigger click: the same R0→R1 diff lands as a bare commit — the way
    // __qa.toRung / a fixture load / a save import reach the renderer.
    render(promote(ready), ready);
    expect(root.querySelector('.slop-scrim')).toBeNull();
  });
});

// ── FB-86/FB-90 — the intro typewriter under the ANIMATED path (MODE!=='test', motion allowed): lines
//    AUTO-advance (a click only speeds up), and an idle re-render of settled state mutates nothing. ──

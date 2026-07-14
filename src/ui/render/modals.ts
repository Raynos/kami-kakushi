// The one-shot OVERLAYS (split out of render.ts, 2026-07-13 render-split): the rank-up
// seal, the T0→T1 ascension ceremony (ADR-062), and the slop-threshold warnings
// (human, 2026-07-10).
import { currentRank, NAMES, type GameState } from '../../core';
import { el } from '../render';
import type { Sfx } from '../sfx';

export function createOverlays(ctx: {
  /** The shell hosts the rank/ascension seals; the slop warning mounts root-level. */
  shell: HTMLElement;
  root: HTMLElement;
  sfx: Sfx;
}): {
  showRankUp(state: GameState): void;
  showAscension(state: GameState): void;
  showSlopWarning(target: 'R1' | 'R2'): void;
} {
  const { shell, root, sfx } = ctx;

  function showRankUp(state: GameState): void {
    sfx.rankUp(); // the rank-up flourish — a struck temple-bell 鈴 (T0-M1-F4)
    const rank = currentRank(state);
    const overlay = el('div', 'rankup-seal');
    overlay.setAttribute('role', 'status');
    const inner = el('div', 'seal-inner');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      inner.classList.add('animate');
    inner.append(el('div', 'rankup-kicker', 'Promoted'));
    const seal = el('div', 'hanko-css');
    seal.lang = 'ja';
    seal.textContent = rank.kanji;
    inner.append(seal);
    inner.append(el('div', 'rankup-title', rank.title));
    overlay.append(inner);
    shell.append(overlay);
    window.setTimeout(() => overlay.remove(), 1900);
  }

  // the T0→T1 ascension ceremony (ADR-062 — the first ascension always lands BIG): a larger,
  // longer-held title card than a rung promotion, the silhouettes stirring behind it.
  function showAscension(state: GameState): void {
    sfx.rankUp(); // the ascension also rings the bell (the bigger ceremony, ADR-062)
    const overlay = el('div', 'rankup-seal ascension');
    overlay.setAttribute('role', 'status');
    const inner = el('div', 'seal-inner');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      inner.classList.add('animate');
    inner.append(el('div', 'rankup-kicker', 'The house rises'));
    const seal = el('div', 'hanko-css');
    seal.lang = 'ja';
    seal.textContent = '家産'; // the Estate pillar, ascended
    inner.append(seal);
    inner.append(el('div', 'rankup-title', `A man of the ${NAMES.house}`));
    inner.append(
      el(
        'div',
        'rankup-kicker subtitle',
        'The Estate pillar stands. The next stirs.',
      ),
    );
    overlay.append(inner);
    shell.append(overlay);
    void state;
    window.setTimeout(() => overlay.remove(), 3200);
  }

  // ── SLOP threshold gates (human, 2026-07-10) ────────────────────────────────
  // R0 is the reviewed floor: everything past it is unreviewed ("slop"), and
  // everything past R1 is untested vibe coding ("turbo slop"). Crossing each
  // threshold interposes a warning, closable the house way (× / Escape — human
  // follow-up, 2026-07-10); the R2 gate's CONFIRM still demands typed consent.
  // Opens root-level at the modal layer, on the shell only — a live rung-up VN
  // plays out first (the pendingSlopWarning hold). Fired from the render pass's
  // exact-promotion diff, so a DEV fixture jump across rungs never trips it.
  function showSlopWarning(target: 'R1' | 'R2'): void {
    const scrim = el('div', 'modal-scrim slop-scrim');
    const card = el('div', 'modal-card frame slop-card');
    card.setAttribute('role', 'alertdialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'Content warning');
    const close = (): void => {
      scrim.remove();
      document.removeEventListener('keydown', onEsc);
    };
    const onEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onEsc);
    const x = el('button', 'modal-close', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', close);
    card.append(x);
    card.append(
      el(
        'div',
        'slop-kicker',
        target === 'R1' ? 'Warning — slop' : 'Warning — turbo slop',
      ),
      el(
        'p',
        'slop-body',
        target === 'R1'
          ? 'Slop is here. Everything past this rung is unreviewed.'
          : 'Turbo slop is here. Everything past this rung is completely untested ' +
              'pure vibe coding — Jake has not seen any of this yet.',
      ),
    );
    const confirm = el(
      'button',
      'verb primary slop-confirm',
      'Confirm to continue',
    );
    confirm.type = 'button';
    confirm.addEventListener('click', close);
    let focusTarget: HTMLElement = confirm;
    if (target === 'R2') {
      const sentence = 'Yes I really want to play the vibe slop let me in.';
      confirm.disabled = true;
      const gate = el('div', 'slop-gate');
      gate.append(
        el('div', 'slop-gate-label', 'Type this, exactly, to continue:'),
        el('div', 'slop-sentence', `“${sentence}”`),
      );
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'slop-input';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.setAttribute('aria-label', 'Type the sentence to continue');
      input.addEventListener('input', () => {
        confirm.disabled = input.value.trim() !== sentence;
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !confirm.disabled) confirm.click();
      });
      gate.append(input);
      card.append(gate);
      focusTarget = input;
    }
    card.append(confirm);
    // the settings-modal Tab trap (D-Q-a11y), minus every close affordance
    card.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = card.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input',
      );
      if (f.length === 0) return;
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    scrim.append(card);
    root.append(scrim);
    focusTarget.focus();
  }

  return { showRankUp, showAscension, showSlopWarning };
}

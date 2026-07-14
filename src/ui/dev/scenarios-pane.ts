// The DEV panel's SCENARIOS pane (split out of dev.ts, 2026-07-13 render-split): the FB-6
// named scenario-save fixtures. DEV-only, riding dev.ts's DEV fold.
import { el } from '../render';
import { FIXTURES_SENTINEL } from '../../fixtures';
import { mono } from './widgets';
import type { DevQa } from '../dev';

export function buildScenariosPane(opts: {
  pane: HTMLElement;
  qa: DevQa;
  /** Lights the footer's "↩ last backup" button — every Load is backup-first (FB-96). */
  enableRestore: () => void;
}): void {
  const { pane, qa, enableRestore } = opts;

  // FB-6 — populate the Scenarios pane: one row per fixture (name · blurb · Load), GROUPED into
  // game-progression sections with a header per section (human, 2026-07-07 — qa.fixtures() sorts
  // earliest-first + filters the hidden rung-start set). loadFixture is backup-first (it snapshots
  // the current run to the FB-96 slot), so a load can never destroy the human's real save — lighting
  // "↩ last backup" is the way home. The sentinel stamps the pane so the strip gate (gh-pages.sh)
  // can grep-prove these DEV bytes never ship (Ph3, R2).
  pane.dataset.sentinel = FIXTURES_SENTINEL;
  let lastGroup: string | null = null;
  // The rung-start rows carry the gold "now" mark the retired Settings→Rung strip used to: the row
  // for the rung the run is actually AT reads highlighted, and re-marks after every load. TST4 — the
  // dev never has to guess which rung a loaded save landed on.
  const rungRows = new Map<string, HTMLElement>();
  const markRung = (): void => {
    const active = `rung-${qa.selectors.rung()}`;
    for (const [name, nm] of rungRows) {
      const on = name === active;
      nm.style.color = on ? '#b08d4f' : '#e7d9bc';
      nm.textContent = on ? `${name} · now` : name;
    }
  };
  for (const { name, blurb, group } of qa.fixtures()) {
    if (group !== lastGroup) {
      const hdr = el('div', undefined, group);
      hdr.style.cssText =
        'font-weight:700;color:#b08d4f;text-transform:uppercase;letter-spacing:.05em;font-size:10px;' +
        `margin-top:${lastGroup === null ? '0' : '.5rem'};padding-bottom:.15rem;border-bottom:1px solid #b08d4f;`;
      pane.append(hdr);
      lastGroup = group;
    }
    const row = el('div');
    row.style.cssText =
      'display:flex;flex-direction:column;gap:.1rem;padding:.3rem 0;border-bottom:1px solid #3a322a;';
    const top = el('div');
    top.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;gap:.5rem;';
    const nm = el('div', undefined, name);
    nm.style.cssText =
      'font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;';
    if (name.startsWith('rung-')) rungRows.set(name, nm);
    const loadBtn = mono('Load', () => {
      void Promise.resolve(qa.loadFixture(name)).then(() => {
        markRung();
        enableRestore();
      });
    });
    top.append(nm, loadBtn);
    const bl = el('div', undefined, blurb);
    bl.style.cssText = 'font-size:11px;color:#a89878;line-height:1.35;';
    row.append(top, bl);
    pane.append(row);
  }
  markRung(); // mark the rung the game is currently at
}

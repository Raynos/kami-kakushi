// pictograms/sheet.ts — the #15 A/B contact sheet (DEV-only, protos-pane
// launcher): all eleven items BOTH ways — the stroke-grammar pictogram (A)
// against the shipped cooled emoji (B) — in two registers: the ROW-SCALE
// grid (16px, the test — all eleven visible at once) above the CRAFT strip
// (96px tiles, the close view), on the dark steel ground. "Blind" mode
// strips names AND the craft strip so the blind-pass capture shows exactly
// what the rubric scores: unlabeled marks at row scale. Nothing here
// ships — the HR verdict owns that.

import { sv } from '../map-sheets/brush';
import { PICTO_GRID, drawPictogram } from './glyphs';
import type { PictogramId } from './glyphs';

/** One seed for every open (TST2) — the same seed the golden pin hashes. */
const SEED = 'ab-2026-07-18';

/** Emoji twins — ui-design.md §7 where curated; `nearest` per README. */
const ROWS: readonly {
  readonly id: PictogramId;
  readonly kanji: string;
  readonly label: string;
  readonly emoji: string;
}[] = [
  { id: 'rice', kanji: '米', label: 'rice', emoji: '🌾' },
  { id: 'coin', kanji: '銭', label: 'coin', emoji: '🪙' },
  { id: 'wood', kanji: '木', label: 'wood', emoji: '🪵' },
  { id: 'sake', kanji: '酒', label: 'sake flask', emoji: '🍶' },
  { id: 'deed', kanji: '証文', label: 'a deed', emoji: '📜' },
  { id: 'blade', kanji: '刃', label: 'a blade', emoji: '⚔️' },
  { id: 'straw_mat', kanji: '筵', label: 'straw mat', emoji: '🧺' },
  { id: 'bowl', kanji: '椀', label: 'rice bowl', emoji: '🍚' },
  { id: 'bedding', kanji: '布団', label: 'futon', emoji: '🛏️' },
  { id: 'hearth', kanji: '囲炉裏', label: 'sunken hearth', emoji: '🔥' },
  { id: 'chest', kanji: '長持', label: 'clothes chest', emoji: '📦' },
];

const CSS = `
.psh-card { width: min(680px, 94vw); max-width: min(680px, 94vw); max-height: 92vh; display: flex; flex-direction: column; }
.psh-scroll { overflow: auto; padding: .4rem .8rem .8rem; }
.psh-sect {
  font-size: 10px; letter-spacing: .05em; text-transform: uppercase;
  color: var(--ink-soft); margin: .5rem 0 .3rem;
  border-bottom: 1px solid var(--silver-faint); padding-bottom: .15rem;
}
.psh-grid {
  display: grid;
  grid-template-columns: 1.2rem minmax(9rem, 1fr) 2.4rem 2.4rem;
  align-items: center; column-gap: .6rem; row-gap: 3px;
}
.psh-head { font-size: 10px; letter-spacing: .05em; text-transform: uppercase; color: var(--ink-soft); }
.psh-num { font-size: 11px; color: var(--ink-soft); text-align: right; }
.psh-name { display: flex; align-items: baseline; gap: .45rem; min-width: 0; }
.psh-name .kanji { font-family: var(--font-head); font-size: 14px; color: var(--ink); white-space: nowrap; }
.psh-name .roman { font-size: 10px; color: var(--ink-soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.psh-cell {
  background: var(--steel-1); border: 1px solid var(--silver-faint);
  border-radius: 3px; display: flex; align-items: center; justify-content: center;
  height: 24px;
}
.psh-cell .emoji { font-size: 15px; line-height: 1; }
.psh-craft { display: flex; flex-wrap: wrap; gap: .5rem; }
.psh-tile { display: flex; flex-direction: column; gap: 2px; flex: 0 0 auto; }
.psh-tile .pair { display: flex; gap: 2px; }
.psh-tile .big {
  width: 104px; height: 104px; background: var(--steel-0);
  border: 1px solid var(--silver-faint); border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
}
.psh-tile .big .emoji { font-size: 78px; line-height: 1; }
.psh-tile .cap { font-size: 10px; color: var(--ink-soft); text-align: center; }
.psh-hint { font-size: 11px; color: var(--ink-soft); padding: .5rem .8rem .8rem; }
.psh-tools { display: flex; gap: .5rem; padding: 0 .8rem; }
.psh-btn {
  background: var(--steel-2); color: var(--ink); border: 1px solid var(--silver-wire);
  border-radius: 3px; padding: .18rem .4rem; font: inherit; font-size: 11px; cursor: pointer;
}
.psh-blind .psh-name, .psh-blind .psh-name-head { visibility: hidden; }
.psh-blind .psh-craft, .psh-blind .psh-craft-sect { display: none; }
`;

function hd<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

function pictoSvg(id: PictogramId, px: number): SVGSVGElement {
  const svg = sv('svg', {
    viewBox: `0 0 ${PICTO_GRID} ${PICTO_GRID}`,
    width: String(px),
    height: String(px),
    'aria-hidden': 'true',
  }) as SVGSVGElement;
  drawPictogram(svg, id, { seed: SEED });
  return svg;
}

function emojiSpan(ch: string): HTMLSpanElement {
  const s = hd('span', 'emoji', ch);
  s.setAttribute('aria-hidden', 'true');
  return s;
}

export function openPictogramSheet(): HTMLElement {
  const scrim = hd('div', 'modal-scrim');
  scrim.style.zIndex = '10000'; // above the DEV panel, like the map sheets
  const card = hd('div', 'modal-card frame psh-card');
  scrim.append(card);

  const style = document.createElement('style');
  style.textContent = CSS;
  card.append(style);

  const close = hd('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the pictogram sheet');
  card.append(close);

  const title = hd('div', 'modal-title');
  title.append(
    hd('span', 'kami', '絵符'),
    hd('span', 'roman', 'Pictogram A/B — 11 marks both ways (#15)'),
  );
  card.append(title);

  const tools = hd('div', 'psh-tools');
  const blindBtn = hd('button', 'psh-btn', 'blind mode: off');
  blindBtn.type = 'button';
  blindBtn.addEventListener('click', () => {
    const on = card.classList.toggle('psh-blind');
    blindBtn.textContent = `blind mode: ${on ? 'on' : 'off'}`;
  });
  tools.append(blindBtn);
  card.append(tools);

  const scroll = hd('div', 'psh-scroll');

  // ── the row-scale grid: the TEST — all eleven at 16px at once ──
  scroll.append(hd('div', 'psh-sect', 'Row scale · 16px — the test'));
  const grid = hd('div', 'psh-grid');
  grid.append(
    hd('div', 'psh-head', '#'),
    hd('div', 'psh-head psh-name-head', 'item'),
    hd('div', 'psh-head', 'A'),
    hd('div', 'psh-head', 'B'),
  );
  ROWS.forEach((row, i) => {
    grid.append(hd('div', 'psh-num', String(i + 1)));
    const name = hd('div', 'psh-name');
    name.append(
      hd('span', 'kanji', row.kanji),
      hd('span', 'roman', `${row.label} · ${row.id}`),
    );
    grid.append(name);
    const a16 = hd('div', 'psh-cell');
    a16.append(pictoSvg(row.id, 16));
    const b16 = hd('div', 'psh-cell');
    b16.append(emojiSpan(row.emoji));
    grid.append(a16, b16);
  });
  scroll.append(grid);

  // ── the craft strip: A|B tiles at 96px, one per item ──
  const craftSect = hd(
    'div',
    'psh-sect psh-craft-sect',
    'Craft view · 96px — A pictogram | B emoji',
  );
  scroll.append(craftSect);
  const craft = hd('div', 'psh-craft');
  ROWS.forEach((row, i) => {
    const tile = hd('div', 'psh-tile');
    const pair = hd('div', 'pair');
    const a = hd('div', 'big');
    a.append(pictoSvg(row.id, 96));
    const b = hd('div', 'big');
    b.append(emojiSpan(row.emoji));
    pair.append(a, b);
    tile.append(pair, hd('div', 'cap', `${i + 1} · ${row.label}`));
    craft.append(tile);
  });
  scroll.append(craft);
  card.append(scroll);

  card.append(
    hd(
      'div',
      'psh-hint',
      'A = stroke-grammar pictograms (one hand: ≤5 strokes, one weight, ' +
        'var(--ink), seeded brush jitter) · B = the shipped cooled emoji. ' +
        'Row scale is the test; the craft strip is the close view. Blind ' +
        'mode strips names and the craft strip for the blind-pass ' +
        'capture. Verdict flows via the HR item, not from here.',
    ),
  );

  const dispose = (): void => {
    document.removeEventListener('keydown', onKey);
    scrim.remove();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') dispose();
  };
  document.addEventListener('keydown', onKey);
  close.addEventListener('click', dispose);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) dispose();
  });

  document.body.append(scrim);
  return scrim;
}

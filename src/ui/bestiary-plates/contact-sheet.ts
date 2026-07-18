// bestiary-plates/contact-sheet.ts — the DEV review surface (plan step 3):
// every foe's plate, faced AND unfaced, at panel scale + enlarged on
// click. A "blind" toggle strips every label for the naming crop the
// rubric's B2 test captures (readers must name the beast from the
// silhouette alone). DEV-only: imported by ui/dev/protos-pane.ts alone,
// riding its strip fold; zero game integration.

import { MOBS } from '../../core';
import type { MobId } from '../../core';
import { sv } from '../map-sheets/brush';
import { PLATE_H, PLATE_W, drawPlate } from './plates';

const SEED = 'jufu-v1';

const CSS = `
.bpc-card{display:flex;flex-direction:column;gap:8px;max-width:min(96vw,1180px);max-height:92dvh}
.bpc-scroll{overflow:auto;flex:1;min-height:0}
.bpc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;padding:4px}
.bpc-cell{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:zoom-in}
.bpc-cell svg{width:100%;height:auto;display:block}
.bpc-cap{font-size:11px;color:var(--ink-soft)}
.bpc-tools{display:flex;gap:8px;align-items:center}
.bpc-big{position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;background:rgba(6,8,12,.82);cursor:zoom-out}
.bpc-big svg{height:min(92dvh,900px);width:auto}
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

function plateSvg(id: MobId, faced: boolean, blind: boolean): SVGSVGElement {
  const svg = sv('svg', {
    viewBox: `0 0 ${PLATE_W} ${PLATE_H}`,
    preserveAspectRatio: 'xMidYMid meet',
  }) as SVGSVGElement;
  drawPlate(svg, id, { seed: SEED, faced, blind });
  return svg;
}

export function openContactSheet(): HTMLElement {
  const scrim = hd('div', 'modal-scrim');
  scrim.style.zIndex = '10000';
  const card = hd('div', 'modal-card frame bpc-card');
  scrim.append(card);

  const style = document.createElement('style');
  style.textContent = CSS;
  card.append(style);

  const close = hd('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the beast register');
  card.append(close);

  const title = hd('div', 'modal-title');
  title.append(
    hd('span', 'kami', '獣譜'),
    hd(
      'span',
      'roman',
      '#4 contact sheet — the beast register plates (faced + unfaced; click to enlarge)',
    ),
  );
  card.append(title);

  const tools = hd('div', 'bpc-tools');
  const blindBtn = hd('button', 'verb', 'Blind crop: off');
  blindBtn.type = 'button';
  tools.append(
    blindBtn,
    hd(
      'span',
      'bpc-cap',
      'Blind strips titles/marks for the naming test (rubric B2).',
    ),
  );
  card.append(tools);

  const scroll = hd('div', 'bpc-scroll');
  const grid = hd('div', 'bpc-grid');
  scroll.append(grid);
  card.append(scroll);

  let blind = false;

  const enlarge = (id: MobId, faced: boolean): void => {
    const big = hd('div', 'bpc-big');
    big.append(plateSvg(id, faced, blind));
    big.addEventListener('click', () => big.remove());
    scrim.append(big);
  };

  const paint = (): void => {
    grid.replaceChildren();
    for (const mob of MOBS) {
      for (const faced of [true, false]) {
        const cell = hd('div', 'bpc-cell');
        cell.append(plateSvg(mob.id, faced, blind));
        cell.append(
          hd(
            'div',
            'bpc-cap',
            blind
              ? faced
                ? '(blind)'
                : '(ruined)'
              : `${mob.kanji} ${mob.label} — ${faced ? 'confirmed' : 'ruined'}`,
          ),
        );
        cell.addEventListener('click', () => enlarge(mob.id, faced));
        grid.append(cell);
      }
    }
  };
  paint();

  blindBtn.addEventListener('click', () => {
    blind = !blind;
    blindBtn.textContent = `Blind crop: ${blind ? 'on' : 'off'}`;
    paint();
  });

  const dispose = (): void => scrim.remove();
  close.addEventListener('click', dispose);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) dispose();
  });
  document.body.append(scrim);
  return scrim;
}

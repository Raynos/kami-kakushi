// estate-sheet/demo.ts — the E1 DEV modal: both look variants (A fold-up ·
// B section-cut) and the three fixture eras, switchable live. DEV-only
// (imported by ui/dev.ts alone, riding its strip fold); the fixture is the
// only data source — zero game integration (the prototype-first law). The
// sheet repaints ONLY on an explicit toggle click (P4); the modal shell is
// fixed and never resizes under the toggles (P5).

import { sv } from '../map-sheets/brush';
import { ERAS } from './fixture';
import type { EstateFixture } from './fixture';
import { paintSheetA, SHEET_A_H, SHEET_A_W } from './sheet-a';
import { paintSheetB, SHEET_B_H, SHEET_B_W } from './sheet-b';

type Variant = 'a' | 'b';

let uidCounter = 0;

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

const CSS = `
  .esh-card { max-width:none; width:100%; height:calc(100dvh - 2rem); overflow:hidden;
    display:flex; flex-direction:column; }
  .esh-bar { flex:0 0 auto; display:flex; gap:.6rem; align-items:center; flex-wrap:wrap;
    margin-top:.55rem; font-size:11px; }
  .esh-bar .lbl { color:var(--text-mute); text-transform:uppercase; letter-spacing:.06em; }
  .esh-bar button { font:inherit; font-size:11px; padding:.14rem .5rem; cursor:pointer;
    background:var(--steel-1); color:var(--text-2); border:1px solid var(--silver-faint);
    border-radius:2px; }
  .esh-bar button[data-on='1'] { background:var(--steel-2); color:var(--text);
    border-color:var(--silver-dim); }
  .esh-scroll { flex:1 1 auto; min-height:0; margin-top:.55rem; overflow:auto;
    border:1px solid var(--silver-faint); background:var(--steel-0); }
  .esh-scroll svg { display:block; margin:0 auto; }
  .esh-hint { flex:0 0 auto; font-size:11px; color:var(--ink-faint); margin-top:.4rem; }
`;

function paintInto(
  scroll: HTMLElement,
  variant: Variant,
  fx: EstateFixture,
): void {
  const w = variant === 'a' ? SHEET_A_W : SHEET_B_W;
  const h = variant === 'a' ? SHEET_A_H : SHEET_B_H;
  const uid = `esh-${++uidCounter}`;
  const svg = sv('svg', {
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: 'xMidYMin meet',
  }) as SVGSVGElement;
  svg.style.width = '100%';
  svg.style.height = 'auto';
  // the paper-wobble filter — the same displacement idiom the sheets use
  const defs = sv('defs');
  const filter = sv('filter', {
    id: `${uid}-w`,
    x: '-3%',
    y: '-3%',
    width: '106%',
    height: '106%',
  });
  filter.append(
    sv('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: '0.012',
      numOctaves: '2',
      seed: '7',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '2.6' }),
  );
  defs.append(filter);
  svg.append(defs);
  const art = sv('g', { filter: `url(#${uid}-w)` });
  svg.append(art);
  if (variant === 'a') paintSheetA(art, fx);
  else paintSheetB(art, fx);
  scroll.replaceChildren(svg);
}

/** Open the E1 estate-cutaway prototype as a full-screen DEV modal. */
export function openEstateSheet(): HTMLElement {
  const scrim = hd('div', 'modal-scrim');
  scrim.style.zIndex = '10000'; // above the DEV panel, like the map review sheets
  const card = hd('div', 'modal-card frame esh-card');
  scrim.append(card);

  const style = document.createElement('style');
  style.textContent = CSS;
  card.append(style);

  const close = hd('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the estate sheet');
  card.append(close);

  const title = hd('div', 'modal-title');
  title.append(
    hd('span', 'kami', '起こし絵図'),
    hd(
      'span',
      'roman',
      'E1 prototype — the estate cutaway (okoshi-ezu · fixture-fed)',
    ),
  );
  card.append(title);

  let variant: Variant = 'a';
  let era = ERAS[0]!;

  const bar = hd('div', 'esh-bar');
  const mkBtn = (
    label: string,
    on: () => boolean,
    click: () => void,
  ): HTMLButtonElement => {
    const b = hd('button', undefined, label);
    b.type = 'button';
    b.addEventListener('click', () => {
      click();
      repaint();
    });
    syncs.push(() => b.setAttribute('data-on', on() ? '1' : '0'));
    return b;
  };
  const syncs: (() => void)[] = [];
  bar.append(hd('span', 'lbl', 'look'));
  bar.append(
    mkBtn(
      'A · fold-up 折起し',
      () => variant === 'a',
      () => (variant = 'a'),
    ),
    mkBtn(
      'B · section-cut 断面',
      () => variant === 'b',
      () => (variant = 'b'),
    ),
  );
  bar.append(hd('span', 'lbl', '· era'));
  for (const e of ERAS) {
    bar.append(
      mkBtn(
        e.en,
        () => era.id === e.id,
        () => (era = e),
      ),
    );
  }
  card.append(bar);

  const scroll = hd('div', 'esh-scroll');
  card.append(scroll);
  card.append(
    hd(
      'div',
      'esh-hint',
      'The household’s own repair sheet: geometry never moves — only the ink answers ' +
        'state (gold = fresh work · red = the reviser · shutters = closed-but-kept). ' +
        'Hover parts for their names. DEV-only prototype from a static fixture; ' +
        'zero game integration. Spec + rubric: src/ui/estate-sheet/README.md.',
    ),
  );

  const repaint = (): void => {
    for (const s of syncs) s();
    paintInto(scroll, variant, era);
  };
  repaint();

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

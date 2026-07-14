// porter-token.ts — the 根付 porter game-piece (FB-340 v2, human-picked
// 2026-07-11 from the map-token-presence prototype rounds): a carved-boxwood
// netsuke porter — bundle roped high on the back, staff planted, head bowed
// into the stride, a shu carry-cord as the "you" accent — standing ON the
// survey sheet like a physical marker. The sculpt is the prototype's, colours
// re-sourced to the --piece-* tokens (styles.css, AC-21).
//
// The piece is an INDICATOR, never an avatar: display-only, pointer-events
// none, mounted where the player IS and walked by the presence player during
// a real move_to. All movement math lives in porter-math.ts (pure).

import { sv } from '../map-sheets/brush';
import { PORTER_SCALE } from './porter-math';

/** Build one porter piece, feet at local (0,0), facing east (the walk reads
 *  left→right; the presence player flips it west via scaleX when walking
 *  leftward). `idSuffix` keeps gradient ids unique when a resting and a
 *  walking piece coexist for a frame. */
export function buildPorter(idSuffix: string): SVGGElement {
  const g = sv('g', {
    class: 'sheetmap-porter',
    'pointer-events': 'none',
    'aria-hidden': 'true',
  }) as SVGGElement;

  const woodId = `porter-wood-${idSuffix}`;
  const defs = sv('defs');
  const lg = sv('linearGradient', {
    id: woodId,
    x1: '0',
    y1: '0',
    x2: '0.7',
    y2: '1',
  });
  lg.append(
    sv('stop', { offset: '0%', 'stop-color': 'var(--piece-wood-hi)' }),
    sv('stop', { offset: '45%', 'stop-color': 'var(--piece-wood-mid)' }),
    sv('stop', { offset: '100%', 'stop-color': 'var(--piece-wood-lo)' }),
  );
  defs.append(lg);
  g.append(defs);

  // contact shadow — the piece presses on the paper, offset like the sheet's
  // own lantern light
  g.append(
    sv('ellipse', {
      cx: '3',
      cy: '3',
      rx: '20',
      ry: '8',
      fill: '#000',
      opacity: '0.45',
    }),
  );

  const fig = sv('g', { transform: `scale(${PORTER_SCALE})` });
  // staff, planted ahead of the stride
  fig.append(
    sv('line', {
      x1: '17',
      y1: '-46',
      x2: '12',
      y2: '-2',
      stroke: 'var(--piece-rope)',
      'stroke-width': '2.6',
      'stroke-linecap': 'round',
    }),
  );
  // stride legs
  fig.append(
    sv('path', {
      d: 'M -4 -12 L -9 -2 M 5 -12 L 8 -2',
      fill: 'none',
      stroke: 'var(--piece-wood-lo)',
      'stroke-width': '5.5',
      'stroke-linecap': 'round',
    }),
  );
  // torso leaning into the walk
  fig.append(
    sv('path', {
      d: 'M -8 -8 C -11 -18, -8 -30, 0 -34 C 7 -37, 12 -33, 12 -27 C 12 -19, 10 -12, 9 -8 C 4 -4, -4 -4, -8 -8 Z',
      fill: `url(#${woodId})`,
      stroke: 'var(--piece-carve)',
      'stroke-width': '1.6',
    }),
  );
  // the bundle, roped high on the back
  fig.append(
    sv('ellipse', {
      cx: '-8',
      cy: '-38',
      rx: '10.5',
      ry: '8.5',
      transform: 'rotate(-18 -8 -38)',
      fill: 'var(--piece-wood-mid)',
      stroke: 'var(--piece-carve)',
      'stroke-width': '1.6',
    }),
    sv('path', {
      d: 'M -17 -41 C -10 -35, -2 -34, 2 -37 M -13 -45 C -10 -39, -6 -33, -1 -31',
      fill: 'none',
      stroke: 'var(--piece-rope)',
      'stroke-width': '1.3',
      opacity: '0.9',
    }),
  );
  // head forward of the load, chin down under a carved scarf line
  fig.append(
    sv('circle', {
      cx: '8',
      cy: '-38',
      r: '5.5',
      fill: 'var(--piece-skin)',
      stroke: 'var(--piece-carve)',
      'stroke-width': '1.5',
    }),
    sv('path', {
      d: 'M 3.5 -41.5 C 5.5 -43.5, 10.5 -43.5, 12.5 -40.5',
      fill: 'none',
      stroke: 'var(--piece-carve)',
      'stroke-width': '1.8',
      'stroke-linecap': 'round',
    }),
  );
  // shu carry-cord, bundle to hip — the "you" accent (the presence colour)
  fig.append(
    sv('line', {
      x1: '0.5',
      y1: '-31',
      x2: '4',
      y2: '-20',
      stroke: 'var(--shu)',
      'stroke-width': '2',
      'stroke-linecap': 'round',
    }),
  );
  g.append(fig);
  return g;
}

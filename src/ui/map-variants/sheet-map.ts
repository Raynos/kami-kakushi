// storywave G4.9 — the LIVE estate map tab renderer, rebuilt on the map-sheets geography.
//
// The old `ezu.ts` survey-plan sheet was hand-drawn for the pre-cutover 7-node map; its POS /
// EDGES / ground art key to retired node ids (`gate-forecourt`, `home-paddies`, …) and paint
// NOTHING for the G4 16-zone estate (content/map.ts). This module renders the map tab from the
// ONE aligned geography instead — the `map-sheets` layout ANCHORS + the golden-pinned woodblock
// ground painter (`paintT0Ground`) — and lays the live TRAVEL seals over it: click a seal to walk
// (the real move_to, via MapCtx.move), a conditioning-gated danger edge is greyed WITH its reason
// visible, and unsurveyed ground past the frontier is an unnamed 未測 wash (reveal-as-plot, TST3).
//
// It fills the SAME `.map-nav` container render.ts already builds, and honours the SAME DOM
// contract the map tests assert (`[data-node]` travel seals · `[data-locked]` gated · the
// 黒沢家領内絵図 cartouche · the 未測 fog), so the tab keeps its shipped survey-plan idiom on the
// new content. The alternates from the HR-7 diverge stay stripped (zero flag-debt).

import { getNode, MAP_NODES } from '../../core';
import type { GameState, Intent } from '../../core';
import { rng, sv, tip } from '../map-sheets/brush';
import { ANCHORS, T0_WINDOW } from '../map-sheets/layout';
import { paintT0Ground } from '../map-sheets/t0-sheet';
import { fogFrontier, wireGated, wireTravel, type MapCtx } from './shared';

/** Is a node surveyed (its reveal flag met, or always-open) — and not locked scenery? */
function isSurveyed(id: string, revealed: ReadonlySet<string>): boolean {
  const n = getNode(id);
  if (n.locked) return false;
  return n.revealFlag === undefined || revealed.has(n.revealFlag);
}

/** Draw one zone seal (box + kanji + caption) centred at (x,y) into `seals`, returning the <g>. */
function drawSeal(
  seals: SVGElement,
  id: string,
  x: number,
  y: number,
  opts: { here: boolean; gated: boolean; walkable: boolean; locked: boolean },
): SVGGElement {
  const node = getNode(id);
  const g = sv('g', { class: 'sheetmap-node' }) as SVGGElement;
  const kanji = node.kanji ?? '？';
  const bw = 132;
  const bh = 78;
  const tilt = ((rng(`tilt-${id}`)() - 0.5) * 3).toFixed(2);
  // an invisible hit-target spanning seal + caption (the ezu WebKit-gap lesson)
  g.append(
    sv('rect', {
      x: String(x - bw / 2 - 8),
      y: String(y - bh / 2 - 8),
      width: String(bw + 16),
      height: String(bh + 78),
      fill: 'transparent',
    }),
  );
  const stroke = opts.here
    ? 'var(--shu)'
    : opts.walkable
      ? 'var(--gold)'
      : opts.gated || opts.locked
        ? 'var(--silver-faint)'
        : 'var(--silver-wire)';
  g.append(
    sv('rect', {
      x: String(x - bw / 2),
      y: String(y - bh / 2),
      width: String(bw),
      height: String(bh),
      transform: `rotate(${tilt} ${x} ${y})`,
      fill: opts.here ? 'rgba(191,59,37,0.10)' : 'var(--steel-2)',
      'fill-opacity': '0.9',
      stroke,
      'stroke-width': opts.here ? '2.6' : '1.8',
      'stroke-dasharray': opts.gated || opts.locked ? '8 5' : '',
      class: 'sheetmap-sealbox',
    }),
  );
  g.append(
    sv(
      'text',
      { x: String(x), y: String(y + 16), 'text-anchor': 'middle', class: 'sheetmap-kanji' },
      kanji,
    ),
  );
  g.append(
    sv(
      'text',
      {
        x: String(x),
        y: String(y + bh / 2 + 34),
        'text-anchor': 'middle',
        class: 'sheetmap-caption',
      },
      node.label.replace(/^The /, ''),
    ),
  );
  if (opts.here) {
    g.append(
      sv('circle', {
        cx: String(x),
        cy: String(y),
        r: '92',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '2',
        opacity: '0.85',
      }),
    );
    tip(g, 'You are here');
  }
  seals.append(g);
  return g;
}

const CSS = `
  .sheetmap-wrap { width:100%; }
  .sheetmap-wrap svg { display:block; width:100%; height:auto; background:var(--void);
    border:1px solid var(--silver-faint); }
  .sheetmap-cartouche { font-family:var(--font-head); fill:var(--ink); }
  .sheetmap-kanji { font-family:var(--font-head); font-size:46px; fill:var(--ink); }
  .sheetmap-caption { font-family:var(--font-body); font-size:30px; fill:var(--ink);
    paint-order:stroke; stroke:var(--steel-1); stroke-width:6px; stroke-linejoin:round; }
  .sheetmap-node { cursor:pointer; outline:none; }
  .sheetmap-node[data-locked] { cursor:not-allowed; opacity:0.62; }
  .sheetmap-node:not([data-locked]):hover .sheetmap-sealbox,
  .sheetmap-node:not([data-locked]):focus-visible .sheetmap-sealbox {
    stroke:var(--gold-hi); stroke-width:3; }
  .sheetmap-fog { font-family:var(--font-head); font-size:34px; fill:var(--ink-faint); }
  .sheetmap-gate-why { font-family:var(--font-body); font-size:22px; fill:var(--ink-faint); }
`;

/** Render the live estate map into `container` (the `.map-nav` host render.ts owns).
 *  `ctx` carries the here/revealed/neighbours/move seam; the seals dispatch the real move_to. */
export function renderMapSheet(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
  void state;
  void dispatch; // movement flows through ctx.move (the real move_to)
  const style = document.createElement('style');
  style.textContent = CSS;
  const wrap = document.createElement('div');
  wrap.className = 'sheetmap-wrap';
  const svg = sv('svg', {
    viewBox: `${T0_WINDOW.x} ${T0_WINDOW.y} ${T0_WINDOW.w} ${T0_WINDOW.h}`,
    role: 'img',
    'aria-label': 'The estate survey plan — walk by tapping a zone seal',
    preserveAspectRatio: 'xMidYMid meet',
  });
  const art = sv('g');
  const seals = sv('g');
  svg.append(art, seals);
  paintT0Ground(art, T0_WINDOW);

  // the title cartouche (top-right of the window) — the survey's name.
  const cart = sv(
    'text',
    {
      x: String(T0_WINDOW.x + T0_WINDOW.w - 60),
      y: String(T0_WINDOW.y + 70),
      'text-anchor': 'end',
      'font-size': '40',
      class: 'sheetmap-cartouche',
    },
    '黒沢家領内絵図',
  );
  seals.append(cart);

  const revealed = ctx.revealed;
  const isNeighbour = (id: string): boolean => ctx.neighbours.some((n) => n.id === id);

  // (1) the surveyed zones + locked scenery — a seal each; travel where you may step.
  for (const node of MAP_NODES) {
    const a = ANCHORS[node.id];
    if (!a) continue;
    const here = node.id === ctx.here;
    if (node.locked) {
      // locked scenery (the ruined compound): visible, greyed, NEVER walkable.
      const g = drawSeal(seals, node.id, a.x, a.y, {
        here,
        gated: false,
        walkable: false,
        locked: true,
      });
      (g as unknown as HTMLElement).dataset.node = node.id;
      (g as unknown as HTMLElement).dataset.locked = '1';
      (g as unknown as HTMLElement).setAttribute('aria-disabled', 'true');
      continue;
    }
    if (!isSurveyed(node.id, revealed)) continue;
    const nb = isNeighbour(node.id);
    const gated = nb && !!node.dangerRing && !ctx.condOk;
    const walkable = nb && !gated && !here;
    const g = drawSeal(seals, node.id, a.x, a.y, { here, gated, walkable, locked: false });
    const asHtml = g as unknown as HTMLElement;
    if (walkable) {
      wireTravel(asHtml, node.id, ctx);
      tip(g, `Walk to ${node.label}`);
    } else if (gated) {
      wireGated(asHtml, node.id, ctx);
      // the reason is VISIBLE on the sheet (険 caption), never a dead grey box (§5.9 / TST4).
      seals.append(
        sv(
          'text',
          {
            x: String(a.x),
            y: String(a.y + 78),
            'text-anchor': 'middle',
            class: 'sheetmap-gate-why',
          },
          `険 — ${ctx.gateReason}`,
        ),
      );
    }
  }

  // (2) the fog frontier — unsurveyed ground one step past a revealed node: an unnamed 未測 wash
  //     (reveal-as-plot — never name it). Locked scenery is not fog (it's drawn above).
  for (const id of fogFrontier(revealed).keys()) {
    if (getNode(id).locked) continue;
    const a = ANCHORS[id];
    if (!a) continue;
    const t = sv('text', {
      x: String(a.x),
      y: String(a.y),
      'text-anchor': 'middle',
      class: 'sheetmap-fog',
    });
    t.append(
      sv('tspan', { x: String(a.x), dy: '0' }, '未'),
      sv('tspan', { x: String(a.x), dy: '38' }, '測'),
    );
    tip(t, 'Unsurveyed ground');
    seals.append(t);
  }

  container.append(style, wrap);
  wrap.append(svg);
}

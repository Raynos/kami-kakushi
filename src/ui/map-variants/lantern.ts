// REAL-map diverge take — see docs/plans/fable-2026-07-06-estate-real-map-options.md.
// Built by a dedicated subagent; this module is the take's ONLY file.
//
// K · THE LANTERN MAP (direction #8 — the Andon fog-of-war). The whole estate is ONE
// dark etched steel plate: every building, paddy, road and treeline is engraved ONCE
// across the plate, and each VISITED node is a pool of warm lamplight (an SVG luminance
// mask + warm radial glow) that lifts the etching into gold/silver visibility. The
// current node's lamp burns brightest and carries the lone vermillion wick pip;
// unexplored ground shows only the faintest silhouette of the engraving in the dark,
// with slightly firmer fragment-hints at the fog frontier (never named — reveal-as-plot).
// Estate stages steady & widen the lamps and mend the main-house etching; reopened
// house rooms each light a small window in the omoya. Bimetal discipline: silver =
// labels/state, gold = lamplight/keylines/value, vermillion spent ONLY on the
// you-are-here wick and the danger 険 mark.
import type { MapCtx } from './shared';
import type { GameState, Intent } from '../../core';
import { ACTIVITIES, GRINDABLE_MOBS, PEOPLE } from '../../core';
import { fogFrontier, getNode, h, revealedDepths, wireGated, wireTravel } from './shared';

// ── plate geometry ──────────────────────────────────────────────────────────
const VW = 1000;
const VH = 620;

/** Hand-placed node centres on the plate (viewBox units). The hamlet's shape:
 *  the house compound low-west, the gate as the hub, paddies stepping east,
 *  the woodlot west, the drill yard off the forecourt, and the satoyama
 *  rising north — deep forest at the top edge, where the plate runs dark. */
const POS: Record<string, { x: number; y: number }> = {
  kura: { x: 300, y: 468 },
  'gate-forecourt': { x: 512, y: 408 },
  'home-paddies': { x: 768, y: 330 },
  'woodlot-edge': { x: 250, y: 288 },
  'drill-yard': { x: 668, y: 512 },
  'near-satoyama': { x: 492, y: 196 },
  'deep-satoyama': { x: 528, y: 72 },
};

/** Per-node placement of the kanji seal, the hanging lamp, and the marks row —
 *  tuned so nothing collides with the etched art inside its pool. */
const META: Record<
  string,
  { kanjiAt: [number, number]; lampAt: [number, number]; marksAt: [number, number] }
> = {
  kura: { kanjiAt: [-64, -44], lampAt: [-82, -4], marksAt: [-30, 44] },
  'gate-forecourt': { kanjiAt: [-52, -34], lampAt: [42, -2], marksAt: [0, 58] },
  'home-paddies': { kanjiAt: [58, -42], lampAt: [-70, 4], marksAt: [4, 52] },
  'woodlot-edge': { kanjiAt: [-66, -36], lampAt: [78, -4], marksAt: [-8, 42] },
  'drill-yard': { kanjiAt: [-64, -30], lampAt: [66, -2], marksAt: [0, 44] },
  'near-satoyama': { kanjiAt: [-76, -26], lampAt: [66, 0], marksAt: [0, 42] },
  'deep-satoyama': { kanjiAt: [-80, -18], lampAt: [72, 2], marksAt: [0, 40] },
};

/** Labour mark per skill — a small etched work-kanji inside the pool. */
const ACT_MARK: Record<string, string> = {
  farming: '田',
  conditioning: '荷',
  woodcutting: '薪',
  foraging: '菜',
};

// warm lamp palette (literal — gradient stops can't reliably take var()).
const FLAME_HI = '#f2dca0';
const FLAME = '#d8b978';
const WICK = '#de5a3a';

// ── tiny SVG helpers ────────────────────────────────────────────────────────
const NS = 'http://www.w3.org/2000/svg';

function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

interface StrokeOpts {
  readonly w?: number;
  readonly opacity?: number;
  readonly dash?: string;
  readonly fill?: string;
  readonly cap?: string;
}

function stroke(d: string, colour: string, o: StrokeOpts = {}): SVGPathElement {
  const p = svg('path', {
    d,
    fill: o.fill ?? 'none',
    stroke: colour,
    'stroke-width': String(o.w ?? 1.1),
    'stroke-linecap': o.cap ?? 'round',
    'stroke-linejoin': 'round',
  });
  if (o.opacity !== undefined) p.setAttribute('opacity', String(o.opacity));
  if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
  return p;
}

function group(x: number, y: number): SVGGElement {
  return svg('g', { transform: `translate(${x} ${y})` });
}

function text(
  x: number,
  y: number,
  content: string,
  attrs: Record<string, string> = {},
): SVGTextElement {
  const t = svg('text', { x: String(x), y: String(y), ...attrs });
  t.textContent = content;
  return t;
}

/** A layered pine — trunk + stacked canopy arcs (the etcher's shorthand tree). */
function tree(x: number, y: number, s: number): SVGGElement {
  const g = svg('g', { transform: `translate(${x} ${y}) scale(${s})` });
  g.append(
    stroke('M0,14 V3', 'var(--silver-dim)', { w: 1 }),
    stroke('M-8,5 Q0,-2 8,5', 'var(--silver-dim)', { w: 1 }),
    stroke('M-6,0 Q0,-6 6,0', 'var(--silver-dim)', { w: 1 }),
    stroke('M-4,-5 Q0,-10 4,-5', 'var(--silver-dim)', { w: 1 }),
  );
  return g;
}

// ── the etched line-art, one function per node (local coords, node-centred) ──

/** The house compound: the kura storehouse + the omoya main house. The omoya's
 *  roof is BROKEN (dashed) at estate stage 0 and mends with the stages; each
 *  reopened room's window is etched here (lit separately, unmasked). */
function etchKura(stage: number): { g: SVGGElement; windows: [number, number][] } {
  const g = svg('g');
  const silver = 'var(--silver-dim)';
  // — the kura: raised floor, thick namako walls, gabled roof —
  g.append(
    stroke('M-64,14 h50 v-24 h-50 z', silver, { w: 1.2 }),
    stroke('M-72,-10 L-39,-28 L-6,-10', silver, { w: 1.3 }),
    stroke('M-46,14 v-13 h11 v13', silver, { w: 1 }),
    // namako lattice hint
    stroke('M-60,10 l7,-7 M-53,10 l7,-7 M-27,10 l7,-7', silver, { w: 0.7, opacity: 0.7 }),
    // raised base posts
    stroke('M-66,14 v6 M-12,14 v6 M-68,20 h60', silver, { w: 0.9, opacity: 0.8 }),
  );
  // — the omoya main house, east of the kura —
  const roofD = 'M2,-4 L24,-24 H74 L96,-4';
  g.append(stroke('M10,18 h78 v-22 h-78 z', silver, { w: 1.2 }));
  if (stage < 1) {
    // broken roof-line: gaps in the etch (the house in decline)
    g.append(stroke(roofD, silver, { w: 1.3, dash: '9 6' }));
    g.append(stroke('M24,-24 H74', silver, { w: 1, dash: '6 7', opacity: 0.8 }));
  } else {
    g.append(stroke(roofD, silver, { w: 1.3 }));
    g.append(stroke('M24,-24 H74', silver, { w: 1 }));
  }
  if (stage >= 2) {
    // the swept yard takes shape: fence-line + gate tick
    g.append(stroke('M-70,28 h164', silver, { w: 0.8, dash: '5 4', opacity: 0.7 }));
    g.append(stroke('M40,28 v-6 M48,28 v-6', silver, { w: 0.8, opacity: 0.7 }));
  }
  if (stage >= 3) {
    // the granary annex — a NEW footprint etched onto the plate
    g.append(
      stroke('M96,18 h24 v-16 h-24', silver, { w: 1.1 }),
      stroke('M94,2 L108,-8 L122,2', silver, { w: 1.1 }),
    );
  }
  if (stage >= 4) {
    // the gold ridge-cap: the house made whole, worth a keyline
    g.append(stroke('M24,-24 H74', 'var(--gold)', { w: 1.4, opacity: 0.9 }));
    g.append(stroke('M24,-24 v-5 M74,-24 v-5', 'var(--gold)', { w: 1.2, opacity: 0.9 }));
  }
  // the four room windows along the omoya front (etched frames; lit overlays elsewhere)
  const windows: [number, number][] = [
    [16, 1],
    [35, 1],
    [54, 1],
    [73, 1],
  ];
  for (const [wx, wy] of windows) {
    g.append(stroke(`M${wx},${wy} h11 v9 h-11 z`, silver, { w: 0.8, opacity: 0.85 }));
  }
  return { g, windows };
}

function etchGate(): SVGGElement {
  const g = svg('g');
  const silver = 'var(--silver-dim)';
  g.append(
    // the nagayamon: posts, lintel, tiled roof
    stroke('M-16,18 V-6 M16,18 V-6', silver, { w: 1.3 }),
    stroke('M-25,-6 H25', silver, { w: 1.2 }),
    stroke('M-31,-6 L0,-21 L31,-6', silver, { w: 1.3 }),
    stroke('M0,18 V-4', silver, { w: 0.7, opacity: 0.6 }),
    // the compound walls running off either side, capped
    stroke('M-25,18 H-56 M25,18 H56', silver, { w: 1 }),
    stroke('M-56,18 v-7 M56,18 v-7', silver, { w: 1 }),
    // the swept forecourt: broom-arcs in the dust
    stroke('M-42,30 q42,9 84,0', 'var(--silver-faint)', { w: 1 }),
    stroke('M-32,38 q32,7 64,0', 'var(--silver-faint)', { w: 1 }),
  );
  return g;
}

function etchPaddies(): SVGGElement {
  const g = svg('g');
  // stepped terraces descending east — gold keyline parcels with water-ticks
  for (let i = 0; i < 4; i++) {
    const x = -58 + i * 12;
    const y = -26 + i * 14;
    const w = 84 - i * 8;
    g.append(
      stroke(`M${x},${y} h${w} q7,1 6,7 l-2,5 h-${w + 6} z`, 'var(--gold-dim)', {
        w: 1,
        opacity: 0.9,
      }),
    );
    for (let t = 0; t < 3; t++) {
      const tx = x + 12 + t * 22;
      g.append(stroke(`M${tx},${y + 6} h9`, 'var(--silver-faint)', { w: 1 }));
    }
  }
  return g;
}

function etchWoodlot(): SVGGElement {
  const g = svg('g');
  const silver = 'var(--silver-dim)';
  g.append(
    // the open-front stable shed
    stroke('M-56,-2 L-33,-17 L-10,-2', silver, { w: 1.2 }),
    stroke('M-52,16 V-3 M-33,16 V-6 M-14,16 V-3', silver, { w: 1.1 }),
    stroke('M-56,16 H-10', silver, { w: 1 }),
    stroke('M-46,10 q6,-5 12,0', 'var(--silver-faint)', { w: 1 }),
    // the road that leaves the valley, fading west
    stroke('M-60,26 q-22,5 -40,16', 'var(--gold-dim)', { w: 1, dash: '6 5', opacity: 0.7 }),
  );
  g.append(tree(8, -4, 1), tree(30, 6, 0.8), tree(48, -10, 1.1), tree(64, 2, 0.75));
  return g;
}

function etchDrillYard(): SVGGElement {
  const g = svg('g');
  const silver = 'var(--silver-dim)';
  g.append(
    // the cleared yard
    stroke('M-52,24 L-36,-14 H46 L58,24', 'var(--silver-faint)', { w: 1, dash: '4 5' }),
    // the weapon rack + leaned spears
    stroke('M-22,14 V-9 M-2,14 V-9 M-26,-5 H2', silver, { w: 1.1 }),
    stroke('M-19,12 L-7,-13 M-13,12 L-1,-13', silver, { w: 0.9 }),
    // the makiwara post, straw-wrapped
    stroke('M30,16 V-6', silver, { w: 1.3 }),
    stroke('M27,-2 h6 M27,3 h6 M27,8 h6', silver, { w: 0.8 }),
    // trampled ground
    stroke('M-30,20 h14 M0,22 h12 M22,20 h10', 'var(--silver-faint)', { w: 0.9 }),
  );
  return g;
}

function etchNearSatoyama(): SVGGElement {
  const g = svg('g');
  g.append(
    // the hill contour the treeline stands on
    stroke('M-66,18 Q-24,-12 20,-2 T68,8', 'var(--silver-faint)', { w: 1.1 }),
    // the footpath climbing in from the fields
    stroke('M-4,34 q5,-14 12,-24', 'var(--gold-dim)', { w: 1, dash: '5 5', opacity: 0.8 }),
  );
  g.append(
    tree(-40, 0, 0.85),
    tree(-18, -8, 0.9),
    tree(6, -12, 0.8),
    tree(28, -6, 0.9),
    tree(50, -12, 0.8),
  );
  return g;
}

function etchDeepSatoyama(): SVGGElement {
  const g = svg('g');
  g.append(
    stroke('M-70,20 Q-30,-16 14,-6 T70,2', 'var(--silver-faint)', { w: 1.1 }),
    stroke('M-58,8 Q-20,-24 24,-16', 'var(--silver-faint)', { w: 0.9, opacity: 0.7 }),
    // the boar's wallow
    stroke('M22,18 a13,4 0 1 0 26,0 a13,4 0 1 0 -26,0', 'var(--silver-faint)', { w: 1 }),
    stroke('M26,22 h6 M36,23 h7', 'var(--silver-faint)', { w: 0.8 }),
  );
  g.append(
    tree(-48, -2, 0.75),
    tree(-30, -10, 0.85),
    tree(-12, -16, 0.7),
    tree(6, -10, 0.9),
    tree(24, -18, 0.7),
    tree(44, -8, 0.8),
    tree(60, -14, 0.65),
  );
  return g;
}

function etchFor(id: string, stage: number): SVGGElement {
  switch (id) {
    case 'kura':
      return etchKura(stage).g;
    case 'gate-forecourt':
      return etchGate();
    case 'home-paddies':
      return etchPaddies();
    case 'woodlot-edge':
      return etchWoodlot();
    case 'drill-yard':
      return etchDrillYard();
    case 'near-satoyama':
      return etchNearSatoyama();
    case 'deep-satoyama':
      return etchDeepSatoyama();
    default:
      return svg('g');
  }
}

/** A fog-frontier FRAGMENT — a roof corner, a treeline edge; never the whole
 *  drawing, never a name. The player should feel there is more plate out there. */
function hintFor(id: string): SVGGElement {
  const g = svg('g');
  const c = 'var(--silver-dim)';
  switch (id) {
    case 'gate-forecourt':
      g.append(stroke('M-31,-6 L0,-21 L31,-6', c, { w: 1.2 }));
      break;
    case 'home-paddies':
      g.append(stroke('M-40,-12 h60 q7,1 6,7', c, { w: 1 }));
      break;
    case 'woodlot-edge':
      g.append(stroke('M-8,5 Q0,-2 8,5', c, { w: 1 }), stroke('M22,-1 Q30,-8 38,-1', c, { w: 1 }));
      break;
    case 'drill-yard':
      g.append(stroke('M-26,-5 H2 M-22,14 V-9', c, { w: 1 }));
      break;
    case 'near-satoyama':
    case 'deep-satoyama':
      g.append(
        stroke('M-26,0 Q-18,-8 -10,0', c, { w: 1 }),
        stroke('M2,-4 Q10,-12 18,-4', c, { w: 1 }),
        stroke('M-40,14 Q-6,-6 34,4', c, { w: 0.9, opacity: 0.7 }),
      );
      break;
    default:
      g.append(stroke('M-12,4 L0,-6 L12,4', c, { w: 1 }));
  }
  return g;
}

/** The hanging andon lamp — frame, warm flame, and (current node only) the
 *  lone vermillion wick pip. `gutter` = the conditioning-gated danger lamp. */
function lampGlyph(current: boolean, gutter: boolean): SVGGElement {
  const g = svg('g');
  const halo = svg('circle', {
    cx: '0',
    cy: '-0.5',
    r: current ? '11' : '8',
    fill: 'url(#km-flame)',
  });
  halo.classList.add(gutter ? 'km-gutter' : 'km-flick');
  g.append(halo);
  g.append(
    // the standing lantern: cap-hook, paper box, legs down to a base stone
    stroke('M0,-9 v-3', 'var(--silver-dim)', { w: 0.9 }),
    stroke('M-5,-9 h10 v14 h-10 z M-5,-2 h10', 'var(--silver-dim)', { w: 1 }),
    stroke('M-4,5 v13 M4,5 v13', 'var(--silver-dim)', { w: 0.9 }),
    stroke('M-6,18 h12', 'var(--silver-dim)', { w: 1 }),
  );
  const flame = svg('circle', { cx: '0', cy: '-0.5', r: '2.1', fill: FLAME_HI });
  if (gutter) flame.setAttribute('opacity', '0.75');
  flame.classList.add(gutter ? 'km-gutter' : 'km-flick');
  g.append(flame);
  if (current) {
    g.append(svg('circle', { cx: '0', cy: '2.2', r: '1.4', fill: WICK }));
  }
  return g;
}

/** A tiny lit figure — head + shoulders in warm gold, standing in the lamplight. */
function figureGlyph(x: number, y: number): SVGGElement {
  const g = group(x, y);
  g.append(
    svg('circle', { cx: '0', cy: '-6', r: '2', fill: 'none', stroke: FLAME, 'stroke-width': '1' }),
    stroke('M-3.5,2 q0,-6 3.5,-6 q3.5,0 3.5,6', FLAME, { w: 1 }),
  );
  return g;
}

// ── scoped styles (flicker respects prefers-reduced-motion) ────────────────
const STYLE = `
.km-root { position: relative; margin-top: .5rem; border: 1px solid var(--key-dim);
  border-radius: var(--radius, 3px); background: #070810; overflow: hidden; }
.km-root svg { display: block; width: 100%; height: auto; }
.km-hot { position: absolute; width: 56px; height: 56px; margin: 0; padding: 0;
  transform: translate(-50%, -50%); border: 0; border-radius: 50%;
  background: transparent; font: inherit; }
.km-hot[data-node]:not([data-locked]):hover,
.km-hot[data-node]:not([data-locked]):focus-visible {
  outline: 1px dashed rgba(216, 185, 120, 0.55); outline-offset: 2px; }
.km-hot[data-locked] { cursor: not-allowed; }
@keyframes km-flick { from { opacity: 1; } to { opacity: calc(1 - var(--km-amp, 0.1)); } }
@keyframes km-gutter { from { opacity: 0.95; } to { opacity: 0.4; } }
.km-flick { animation: km-flick 4.8s ease-in-out infinite alternate; }
.km-gutter { animation: km-gutter 1.4s ease-in-out infinite alternate; }
@media (prefers-reduced-motion: reduce) {
  .km-flick, .km-gutter { animation: none; }
  .km-gutter { opacity: 0.6; }
}
.km-legend { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: .3rem;
  font-size: .72rem; color: var(--ink-faint); letter-spacing: .04em; }
`;

// ── the render ──────────────────────────────────────────────────────────────
export function renderMapLantern(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
  void dispatch; // movement goes through ctx.move (the real move_to)
  const depths = revealedDepths(ctx.revealed);
  const fog = fogFrontier(ctx.revealed);
  const stage = Math.max(0, Math.min(4, state.estateStage));

  const root = h('div', 'km-root');
  // lamps steady as the estate rises: stage 0 breathes ±10%, stage 4 ±2%.
  root.style.setProperty('--km-amp', String(0.1 - stage * 0.02));
  const style = document.createElement('style');
  style.textContent = STYLE;
  root.append(style);

  const plate = svg('svg', {
    viewBox: `0 0 ${VW} ${VH}`,
    role: 'img',
    'aria-label': 'The estate under lantern light',
  });
  root.append(plate);

  // ── defs: plate grade, lamp-pool mask gradients, warm glow, vignette ──
  const defs = svg('defs');
  const plateGrad = svg('linearGradient', { id: 'km-plate', x1: '0', y1: '0', x2: '0', y2: '1' });
  plateGrad.append(
    svg('stop', { offset: '0', 'stop-color': '#05060b' }),
    svg('stop', { offset: '0.55', 'stop-color': '#0a0c12' }),
    svg('stop', { offset: '1', 'stop-color': '#070810' }),
  );
  // luminance-mask pool: white core → black — the lamplight's reach over the etch.
  const poolGrad = svg('radialGradient', { id: 'km-pool' });
  poolGrad.append(
    svg('stop', { offset: '0', 'stop-color': '#ffffff' }),
    svg('stop', { offset: '0.5', 'stop-color': '#e6e6e6' }),
    svg('stop', { offset: '0.8', 'stop-color': '#4a4a4a' }),
    svg('stop', { offset: '1', 'stop-color': '#000000' }),
  );
  // the guttering pool (gated danger lamp): weaker core, shorter reach.
  const gutterGrad = svg('radialGradient', { id: 'km-pool-dim' });
  gutterGrad.append(
    svg('stop', { offset: '0', 'stop-color': '#8a8a8a' }),
    svg('stop', { offset: '0.6', 'stop-color': '#3a3a3a' }),
    svg('stop', { offset: '1', 'stop-color': '#000000' }),
  );
  // the warm visible glow painted UNDER the etch.
  const flameGrad = svg('radialGradient', { id: 'km-flame' });
  flameGrad.append(
    svg('stop', { offset: '0', 'stop-color': FLAME_HI, 'stop-opacity': '0.5' }),
    svg('stop', { offset: '0.4', 'stop-color': FLAME, 'stop-opacity': '0.22' }),
    svg('stop', { offset: '1', 'stop-color': FLAME, 'stop-opacity': '0' }),
  );
  const glowGrad = svg('radialGradient', { id: 'km-glow' });
  glowGrad.append(
    svg('stop', { offset: '0', 'stop-color': FLAME_HI, 'stop-opacity': '0.26' }),
    svg('stop', { offset: '0.55', 'stop-color': FLAME, 'stop-opacity': '0.1' }),
    svg('stop', { offset: '1', 'stop-color': FLAME, 'stop-opacity': '0' }),
  );
  const vinGrad = svg('radialGradient', { id: 'km-vin', cx: '0.5', cy: '0.55', r: '0.75' });
  vinGrad.append(
    svg('stop', { offset: '0', 'stop-color': '#000000', 'stop-opacity': '0' }),
    svg('stop', { offset: '0.75', 'stop-color': '#000000', 'stop-opacity': '0' }),
    svg('stop', { offset: '1', 'stop-color': '#000000', 'stop-opacity': '0.55' }),
  );
  defs.append(plateGrad, poolGrad, gutterGrad, flameGrad, glowGrad, vinGrad);

  // ── the light mask: near-black ambience + a pool per revealed node ──
  const mask = svg('mask', { id: 'km-light', maskUnits: 'userSpaceOnUse' });
  mask.append(
    svg('rect', { x: '0', y: '0', width: String(VW), height: String(VH), fill: '#060606' }),
  );
  const baseR = 96 + stage * 7; // the estate's lamps reach farther as it rises
  const gatedHere = (id: string): boolean =>
    !!getNode(id).dangerRing && !ctx.condOk && depths.has(id);
  for (const id of depths.keys()) {
    const p = POS[id];
    if (!p) continue;
    const gutter = gatedHere(id) && id !== ctx.here;
    const r = id === ctx.here ? baseR + 34 : gutter ? 72 : baseR;
    mask.append(
      svg('circle', {
        cx: String(p.x),
        cy: String(p.y),
        r: String(r),
        fill: gutter ? 'url(#km-pool-dim)' : 'url(#km-pool)',
      }),
    );
  }
  // frontier smudges: the dark lifts a hair where known ground meets unknown.
  for (const id of fog.keys()) {
    const p = POS[id];
    if (!p) continue;
    mask.append(
      svg('circle', {
        cx: String(p.x),
        cy: String(p.y),
        r: '48',
        fill: 'url(#km-pool-dim)',
        opacity: '0.22',
      }),
    );
  }
  defs.append(mask);
  plate.append(defs);

  // ── layer 1: the plate itself + brushed grain + the country beyond ──
  plate.append(
    svg('rect', { x: '0', y: '0', width: String(VW), height: String(VH), fill: 'url(#km-plate)' }),
  );
  const grain = svg('g', { opacity: '0.05' });
  for (let i = 1; i < 7; i++) {
    grain.append(
      stroke(`M0,${i * 88 + 12} q ${VW / 2},${i % 2 ? 7 : -7} ${VW},0`, '#cdd6ee', { w: 0.6 }),
    );
  }
  // faint far ridges at the plate's top edge — more country than the lamps reach.
  grain.append(
    stroke('M40,44 Q 300,10 560,34 T 980,26', '#cdd6ee', { w: 0.8 }),
    stroke('M120,20 Q 420,-6 720,16', '#cdd6ee', { w: 0.7 }),
  );
  plate.append(grain);

  // ── layer 2: warm lamplight pools (visible glow beneath the etch) ──
  const glows = svg('g');
  for (const id of depths.keys()) {
    const p = POS[id];
    if (!p) continue;
    const gutter = gatedHere(id) && id !== ctx.here;
    const r = id === ctx.here ? baseR + 26 : gutter ? 60 : baseR - 8;
    const c = svg('circle', {
      cx: String(p.x),
      cy: String(p.y),
      r: String(r),
      fill: 'url(#km-glow)',
    });
    c.classList.add(gutter ? 'km-gutter' : 'km-flick');
    glows.append(c);
    if (id === ctx.here) {
      glows.append(
        svg('circle', { cx: String(p.x), cy: String(p.y), r: '52', fill: 'url(#km-flame)' }),
      );
    }
  }
  plate.append(glows);

  // ── layer 3: the ETCH — every node's art + the roads, drawn once, masked ──
  const etch = svg('g', { mask: 'url(#km-light)' });
  // roads: brushed gold paths between neighbours (drawn once per edge)
  const roads = svg('g');
  const drawn = new Set<string>();
  for (const n of Object.keys(POS)) {
    for (const nb of getNode(n).neighbors) {
      const key = [n, nb].sort().join('~');
      const a = POS[n];
      const b = POS[nb];
      if (drawn.has(key) || !a || !b) continue;
      drawn.add(key);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const side = drawn.size % 2 === 0 ? 1 : -1;
      const cx = mx + (-dy / len) * 16 * side;
      const cy = my + (dx / len) * 16 * side;
      roads.append(
        stroke(`M${a.x},${a.y} Q ${cx},${cy} ${b.x},${b.y}`, 'var(--gold-dim)', {
          w: 4.5,
          opacity: 0.2,
        }),
        stroke(`M${a.x},${a.y} Q ${cx},${cy} ${b.x},${b.y}`, 'var(--gold-dim)', {
          w: 1.5,
          dash: '8 6',
          opacity: 0.9,
        }),
      );
    }
  }
  etch.append(roads);
  // the stream — off the satoyama hills, feeding the paddies, out past the plate's edge
  etch.append(
    stroke('M614,132 C 690,210 676,296 722,352 C 762,412 856,470 962,528', 'var(--silver-faint)', {
      w: 1.4,
    }),
    stroke('M700,300 h10 M716,330 h10 M742,376 h10', 'var(--silver-faint)', { w: 0.9 }),
  );
  let kuraWindows: [number, number][] = [];
  for (const id of Object.keys(POS)) {
    const p = POS[id];
    if (!p) continue;
    const g = group(p.x, p.y);
    if (id === 'kura') {
      const built = etchKura(stage);
      kuraWindows = built.windows;
      g.append(built.g);
    } else {
      g.append(etchFor(id, stage));
    }
    etch.append(g);
  }
  plate.append(etch);

  // ── layer 4: frontier hints — bare fragments in the dark, never named ──
  const hints = svg('g', { opacity: '0.13' });
  for (const id of fog.keys()) {
    const p = POS[id];
    if (!p) continue;
    const g = group(p.x, p.y);
    g.append(hintFor(id));
    hints.append(g);
  }
  plate.append(hints);

  // ── layer 5: lit room windows (light sources — unmasked, glow in the dark) ──
  const rooms = ['house-omoya', 'house-workshops', 'house-granary', 'house-study'];
  const litRooms = svg('g');
  const kuraPos = POS['kura'];
  rooms.forEach((roomId, i) => {
    if (!kuraPos || !state.unlocked.includes(roomId)) return;
    const win = kuraWindows[i];
    if (!win) return;
    const wx = kuraPos.x + win[0];
    const wy = kuraPos.y + win[1];
    litRooms.append(
      svg('circle', {
        cx: String(wx + 5.5),
        cy: String(wy + 4.5),
        r: '10',
        fill: 'url(#km-flame)',
      }),
    );
    const pane = svg('rect', {
      x: String(wx + 1),
      y: String(wy + 1),
      width: '9',
      height: '7',
      fill: FLAME_HI,
      opacity: '0.8',
    });
    pane.classList.add('km-flick');
    const title = svg('title');
    title.textContent = `A lamp burns in the ${roomId.replace('house-', '')}`;
    pane.append(title);
    litRooms.append(pane);
  });
  plate.append(litRooms);

  // ── layer 6: lamps, seals, labels & what's-where marks (revealed only) ──
  const marks = svg('g', {
    'font-family': 'inherit',
    'text-anchor': 'middle',
  });
  for (const id of depths.keys()) {
    const p = POS[id];
    if (!p) continue;
    const node = getNode(id);
    const meta = META[id];
    if (!meta) continue;
    const isHere = id === ctx.here;
    const gutter = gatedHere(id) && !isHere;
    const g = group(p.x, p.y);
    // the hanging lamp
    const lg = group(meta.lampAt[0], meta.lampAt[1]);
    lg.append(lampGlyph(isHere, gutter));
    g.append(lg);
    // the kanji seal (silver = label/state; the current node reads brightest)
    if (node.kanji) {
      const k = text(meta.kanjiAt[0], meta.kanjiAt[1], node.kanji, {
        'font-size': '17',
        fill: isHere ? 'var(--silver-hi)' : 'var(--silver)',
        opacity: gutter ? '0.6' : '0.92',
      });
      k.setAttribute('lang', 'ja');
      g.append(k);
      const nm = text(meta.kanjiAt[0], meta.kanjiAt[1] + 11, node.label.replace(/\s*\(.*\)$/, ''), {
        'font-size': '8',
        fill: 'var(--ink-soft)',
        'letter-spacing': '0.06em',
        opacity: gutter ? '0.55' : '0.8',
      });
      g.append(nm);
    }
    // what's-where: labour (gold work-marks), foes (silver), danger 険 (shu)
    const row = text(meta.marksAt[0], meta.marksAt[1], '', { 'font-size': '11' });
    for (const a of ACTIVITIES.filter((a) => a.area === id)) {
      const t = svg('tspan', { fill: 'var(--gold-dim)', dx: '3' });
      t.textContent = ACT_MARK[a.skill] ?? '労';
      const tt = svg('title');
      tt.textContent = a.label;
      t.append(tt);
      row.append(t);
    }
    for (const m of GRINDABLE_MOBS.filter((m) => m.area === id && (m.minTier ?? 0) <= state.tier)) {
      const t = svg('tspan', { fill: 'var(--silver-dim)', dx: '5', opacity: '0.85' });
      t.textContent = m.kanji;
      const tt = svg('title');
      tt.textContent = m.label;
      t.append(tt);
      row.append(t);
    }
    if (node.dangerRing) {
      const t = svg('tspan', { fill: 'var(--shu)', dx: '5' });
      t.textContent = '険';
      const tt = svg('title');
      tt.textContent = ctx.condOk ? 'Dangerous ground' : ctx.gateReason;
      t.append(tt);
      row.append(t);
    }
    if (row.childNodes.length > 0) g.append(row);
    // people standing in the light
    const folk = PEOPLE.filter(
      (per) =>
        per.node === id &&
        (per.presence === undefined || per.presence(state)) &&
        (per.placeGate === undefined || state.unlocked.includes(per.placeGate)),
    );
    folk.forEach((per, i) => {
      const fx = meta.marksAt[0] - 24 + i * 48;
      const fy = meta.marksAt[1] + 14;
      const fg = figureGlyph(fx, fy);
      const tt = svg('title');
      tt.textContent = per.tell ?? per.name;
      fg.append(tt);
      g.append(fg);
      g.append(
        text(fx, fy + 12, per.name, {
          'font-size': '7.5',
          fill: 'var(--ink-soft)',
          'letter-spacing': '0.05em',
          opacity: '0.85',
        }),
      );
    });
    marks.append(g);
  }
  plate.append(marks);

  // ── layer 7: the vignette — the plate falls away into the dark ──
  plate.append(
    svg('rect', {
      x: '0',
      y: '0',
      width: String(VW),
      height: String(VH),
      fill: 'url(#km-vin)',
      'pointer-events': 'none',
    }),
  );

  // ── HTML hotspots over the plate: real travel controls (44px+ targets) ──
  for (const id of depths.keys()) {
    const p = POS[id];
    if (!p) continue;
    const node = getNode(id);
    const spot = h('button', 'km-hot');
    spot.style.left = `${(p.x / VW) * 100}%`;
    spot.style.top = `${(p.y / VH) * 100}%`;
    const isNb = ctx.neighbours.some((n) => n.id === id);
    if (id === ctx.here) {
      spot.title = 'You are here';
      spot.setAttribute('aria-current', 'location');
      spot.style.cursor = 'default';
    } else if (isNb && node.dangerRing && !ctx.condOk) {
      wireGated(spot, id, ctx);
      spot.setAttribute('aria-label', `${node.label} — ${ctx.gateReason}`);
    } else if (isNb) {
      wireTravel(spot, id, ctx);
      spot.title = node.label;
      spot.setAttribute('aria-label', `Walk to ${node.label}`);
    } else {
      spot.title = node.label;
      spot.style.cursor = 'default';
      spot.disabled = true;
      spot.style.pointerEvents = 'none';
    }
    root.append(spot);
  }

  container.append(root);
  // a whisper of a legend — chrome, not fiction
  const legend = h('div', 'km-legend');
  legend.append(
    h('span', undefined, '灯 lamplit ground'),
    h('span', undefined, '田薪荷菜 labour'),
    h('span', undefined, '険 dangerous ground'),
  );
  container.append(legend);
}

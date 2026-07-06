// REAL-map diverge take I · MODEL BOARD (shōgi-ban diorama) — see
// docs/plans/fable-2026-07-06-estate-real-map-options.md (direction #4).
// The estate as a tabletop model: a blackened-steel board tilted under the
// camera, raised plate TILES per area (real CSS 3D — the plate face rides
// translateZ above a true front-edge quad), buildings as extruded standing
// silhouettes (counter-rotated inline SVG "cutouts"), roads as inlaid tracks
// on the board face, and shōgi-koma PIECES standing where people stand — the
// player's koma (the lone vermillion) at you-are-here. Fog frontier = raw
// unshaped plate with a faint ？, never named. estateStage 0–4 upgrades the
// board's craftsmanship (rough plate → gold keylines → gold road inlay → gold
// roof ridges → bright faces + gold bolts); reopened house rooms add their
// roof-form to the forecourt's standing group. Built by a dedicated subagent;
// this module is the take's ONLY file.
import type { MapCtx } from './shared';
import type { GameState, Intent } from '../../core';
import { ACTIVITIES, getSkill, isUnlocked, MOBS, PEOPLE } from '../../core';
import { fogFrontier, getNode, h, revealedDepths, wireGated, wireTravel } from './shared';

// ── board geometry (logical px, pre-tilt) ─────────────────────────────────
const BOARD_W = 680;
const BOARD_H = 620;
const TILT = 48; // rotateX — the camera looks down the table
const SPIN = -7; // rotateZ — a slight crafted skew
const TH = 12; // plate thickness (translateZ of every tile face)
/** Counter-rotation that stands an element upright to the camera (the exact
 *  inverse of the board's rotateX(TILT) rotateZ(SPIN)). */
const STAND = `rotateZ(${-SPIN}deg) rotateX(${-TILT}deg)`;

interface TileSpec {
  readonly x: number; // centre, % of BOARD_W
  readonly y: number; // centre, % of BOARD_H
  readonly w: number;
  readonly hgt: number;
}

/** Hand-placed plate positions — the estate's real shape: the forecourt hub,
 *  kura + drill-yard flanking it at the front, paddies/woodlot midfield, the
 *  satoyama rising to the back of the board. */
const TILES: Readonly<Record<string, TileSpec>> = {
  'deep-satoyama': { x: 50, y: 10, w: 244, hgt: 102 },
  'near-satoyama': { x: 50, y: 31, w: 220, hgt: 96 },
  'home-paddies': { x: 23, y: 53, w: 184, hgt: 104 },
  'woodlot-edge': { x: 77, y: 53, w: 184, hgt: 104 },
  'gate-forecourt': { x: 50, y: 72, w: 196, hgt: 96 },
  'drill-yard': { x: 21, y: 88, w: 152, hgt: 84 },
  kura: { x: 79, y: 88, w: 152, hgt: 84 },
};

const px = (spec: TileSpec): { cx: number; cy: number } => ({
  cx: (spec.x / 100) * BOARD_W,
  cy: (spec.y / 100) * BOARD_H,
});

// ── one-shot stylesheet ────────────────────────────────────────────────────
const STYLE_ID = 'mb-style';
function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
.mb-scene{position:relative;margin:0 auto;overflow:hidden;}
.mb-persp{position:absolute;inset:0;perspective:1300px;perspective-origin:50% 32%;}
.mb-board{position:absolute;left:50%;top:50%;width:${BOARD_W}px;height:${BOARD_H}px;
  transform-style:preserve-3d;
  background:linear-gradient(160deg,#171a24,#12141d 58%,#0f1119);
  border:1px solid var(--silver-faint);}
.mb-c1 .mb-board{border-color:var(--key-dim);}
.mb-c4 .mb-board{border-color:var(--key);}
.mb-board-edge{position:absolute;top:100%;left:0;width:100%;height:26px;
  transform-origin:top;transform:rotateX(-90deg);
  background:linear-gradient(180deg,#10131c,#070810);
  border-top:1px solid rgba(205,214,238,.16);pointer-events:none;}
.mb-board-edge--l{top:0;left:0;width:26px;height:100%;
  transform-origin:left;transform:rotateY(90deg);
  background:linear-gradient(90deg,#0d1017,#070810);border:none;}
.mb-bolt{position:absolute;width:7px;height:7px;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,rgba(205,214,238,.5),rgba(205,214,238,.12) 65%);
  pointer-events:none;}
.mb-c4 .mb-bolt{background:radial-gradient(circle at 35% 30%,var(--gold),var(--gold-dim) 70%);}
.mb-roads{position:absolute;inset:0;pointer-events:none;}
.mb-road-groove{stroke:#090b11;stroke-width:14;stroke-linecap:round;fill:none;}
.mb-road-inlay{stroke:rgba(205,214,238,.38);stroke-width:3;stroke-dasharray:5 8;
  stroke-linecap:round;fill:none;}
.mb-c2 .mb-road-inlay{stroke:rgba(216,185,120,.55);}
.mb-road--fog .mb-road-inlay{stroke:rgba(205,214,238,.13);}
.mb-road--fog .mb-road-groove{stroke:#0b0d12;}
/* ── the raised plate tile ── */
.mb-tile{position:absolute;transform-style:preserve-3d;}
.mb-tile--live:hover,.mb-tile--live:focus-visible{transform:translateZ(7px);}
.mb-tile--live{transition:transform var(--dur-fast) var(--ease);}
.mb-tile--live:focus-visible{outline:none;}
.mb-tile--live:focus-visible .mb-top{border-color:var(--silver);}
.mb-under{position:absolute;inset:4px -7px -12px 7px;background:rgba(2,3,6,.65);
  filter:blur(4px);pointer-events:none;}
.mb-side{position:absolute;top:100%;left:0;width:100%;height:${TH}px;
  transform-origin:top;transform:translateZ(${TH}px) rotateX(-90deg);
  background:linear-gradient(180deg,#181c27,#0a0c12);
  border-top:1px solid rgba(205,214,238,.22);pointer-events:none;}
.mb-top{position:absolute;inset:0;transform:translateZ(${TH}px);
  background:linear-gradient(168deg,#1d212d,#171a25 62%,#141722);
  border:1px solid rgba(205,214,238,.20);}
.mb-c1 .mb-top{border-color:var(--key-dim);}
.mb-c4 .mb-top{background:linear-gradient(168deg,#1f2431,#181c28 62%,#141824);
  border-color:var(--key);}
.mb-tile--here .mb-top{border-color:var(--gold);
  box-shadow:inset 0 0 0 1px rgba(216,185,120,.25);}
.mb-tile--live .mb-top{cursor:pointer;}
.mb-tile--live:hover .mb-top{border-color:var(--key);
  background:linear-gradient(168deg,#20242f,#181c28 62%,#141824);}
.mb-tile--gated .mb-top{border-style:dashed;border-color:rgba(191,59,37,.45);}
.mb-tile--dim .mb-top{background:linear-gradient(168deg,#161923,#12141e 62%,#10121b);}
/* terrain faces */
.mb-top--paddies{background:
  repeating-linear-gradient(180deg,transparent 0 15px,rgba(216,185,120,.22) 15px 17px),
  repeating-linear-gradient(180deg,#222839 0 17px,#131624 17px 34px);}
.mb-top--forecourt{background:
  radial-gradient(120% 90% at 50% 30%,rgba(205,214,238,.07),transparent 60%),
  linear-gradient(165deg,#1f2330,#171b26);}
.mb-top--drill{background:
  repeating-linear-gradient(115deg,#1c202c 0 9px,#161a25 9px 12px);}
.mb-top--near{background:linear-gradient(170deg,#181c2c,#131627 62%,#101324);}
.mb-top--deep{background:linear-gradient(170deg,#141729,#101323 62%,#0d101e);}
/* fog: raw unshaped plate */
.mb-tile--fog .mb-top{background:linear-gradient(165deg,#12141c,#0e1016);
  border:1px solid rgba(205,214,238,.07);
  clip-path:polygon(2% 9%,96% 0%,100% 92%,5% 100%);}
.mb-tile--fog .mb-side{background:#08090f;border-top-color:rgba(205,214,238,.06);}
.mb-fog-q{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-family:var(--font-head);font-size:30px;color:var(--ink-faint);opacity:.6;}
/* flat marks on the plate face */
.mb-marks{position:absolute;left:8px;top:5px;display:flex;gap:8px;align-items:baseline;
  pointer-events:none;}
.mb-lab{font-size:14px;color:var(--gold-dim);font-family:var(--font-head);}
.mb-c3 .mb-lab{color:var(--gold);}
.mb-foe{font-size:14px;color:rgba(222,90,58,.72);font-family:var(--font-head);}
.mb-gate-reason{position:absolute;right:8px;top:6px;font-size:9px;letter-spacing:.05em;
  color:var(--shu-hi);font-family:var(--font-num);pointer-events:none;white-space:nowrap;}
/* ── standing (counter-rotated) elements ── */
.mb-stand{position:absolute;transform-origin:50% 100%;pointer-events:none;
  transform:translateZ(${TH}px) ${STAND};}
.mb-art{left:50%;bottom:30%;margin-left:-50%;width:100%;display:flex;justify-content:center;}
.mb-art svg{display:block;}
.mb-art .mb-bldg{fill:#0c0f16;stroke:rgba(205,214,238,.22);stroke-width:1;}
.mb-art .mb-roof{fill:#090b11;stroke:rgba(205,214,238,.30);stroke-width:1;}
.mb-art .mb-tree{fill:#0d1119;stroke:rgba(205,214,238,.16);stroke-width:1;}
.mb-art .mb-trunk{fill:#0a0c12;stroke:none;}
.mb-art .mb-detail{fill:none;stroke:rgba(205,214,238,.28);stroke-width:1;}
.mb-art .mb-ridge{fill:none;stroke:rgba(205,214,238,.22);stroke-width:1.2;}
.mb-c3 .mb-art .mb-ridge{stroke:var(--gold-dim);}
.mb-c4 .mb-art .mb-ridge{stroke:var(--gold);}
/* the museum plaque (nameplate) at the plate's front edge */
.mb-plaque{left:50%;bottom:-6px;transform:translateX(-50%) translateZ(${TH}px) ${STAND};
  display:flex;align-items:baseline;gap:6px;padding:2px 9px 3px;white-space:nowrap;
  background:linear-gradient(180deg,#12151d,#0c0e15);
  border:1px solid rgba(205,214,238,.18);border-bottom-width:2px;}
.mb-c2 .mb-plaque{border-color:rgba(216,185,120,.35);}
.mb-plaque-kanji{font-family:var(--font-head);font-size:13px;color:var(--silver);}
.mb-plaque-name{font-family:var(--font-num);font-size:8.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-soft);}
.mb-plaque-danger{font-family:var(--font-head);font-size:11px;color:var(--ink-faint);}
.mb-plaque-danger--hot{color:var(--shu-hi);}
.mb-tile--here .mb-plaque{border-color:var(--gold-dim);}
.mb-tile--here .mb-plaque-kanji{color:var(--gold-hi);}
/* ── koma pieces ── */
.mb-koma{position:relative;clip-path:polygon(50% 0%,84% 15%,96% 100%,4% 100%,16% 15%);
  background:linear-gradient(200deg,rgba(205,214,238,.55),rgba(205,214,238,.14) 45%,rgba(205,214,238,.28));
  display:flex;align-items:flex-end;justify-content:center;}
.mb-koma-in{position:absolute;inset:1.5px;clip-path:polygon(50% 0%,84% 15%,96% 100%,4% 100%,16% 15%);
  background:linear-gradient(190deg,#262b3a,#151823 70%,#181c28);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-head);color:var(--silver);}
.mb-koma--you{background:linear-gradient(200deg,var(--shu-hi),var(--shu-deep) 55%,var(--shu));}
.mb-koma--you .mb-koma-in{color:var(--shu-hi);padding-top:4px;}
.mb-person{bottom:16%;}
.mb-piece{position:absolute;width:0;height:0;transform-style:preserve-3d;pointer-events:none;}
.mb-piece-slide{position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d;}
.mb-piece-stand{position:absolute;left:-14px;bottom:0;transform-origin:50% 100%;
  transform:translateZ(${TH}px) ${STAND};}
.mb-piece-shadow{position:absolute;left:-13px;top:-6px;width:26px;height:11px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent);
  transform:translateZ(${TH + 0.5}px);}
/* caption under the scene */
.mb-caption{margin-top:2px;text-align:center;font-size:var(--fs-micro);color:var(--ink-faint);}
@media (prefers-reduced-motion: reduce){
  .mb-scene *{transition:none !important;animation:none !important;}
}`;
  document.head.append(s);
}

// ── inline-SVG silhouette builders (extruded model cutouts) ────────────────
const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}
function shape(
  tag: 'rect' | 'polygon' | 'path' | 'polyline' | 'circle',
  cls: string,
  attrs: Record<string, string>,
): SVGElement {
  const e = svgEl(tag);
  e.setAttribute('class', cls);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
function artSvg(w: number, hgt: number): SVGSVGElement {
  const s = svgEl('svg');
  s.setAttribute('viewBox', '0 0 160 90');
  s.setAttribute('width', String(w));
  s.setAttribute('height', String(hgt));
  s.setAttribute('aria-hidden', 'true');
  return s;
}
function tree(s: SVGSVGElement, x: number, top: number, spread: number): void {
  const base = 84;
  s.append(
    shape('rect', 'mb-trunk', { x: String(x - 2), y: String(base - 14), width: '4', height: '14' }),
  );
  s.append(
    shape('polygon', 'mb-tree', {
      points: `${x - spread},${base - 12} ${x},${top + 12} ${x + spread},${base - 12}`,
    }),
  );
  s.append(
    shape('polygon', 'mb-tree', {
      points: `${x - spread * 0.72},${base - 26} ${x},${top} ${x + spread * 0.72},${base - 26}`,
    }),
  );
}
function roofed(
  s: SVGSVGElement,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  peak: number,
): void {
  s.append(
    shape('rect', 'mb-bldg', {
      x: String(bx),
      y: String(by),
      width: String(bw),
      height: String(bh),
    }),
  );
  const cx = bx + bw / 2;
  s.append(
    shape('polygon', 'mb-roof', {
      points: `${bx - 6},${by + 2} ${cx},${peak} ${bx + bw + 6},${by + 2}`,
    }),
  );
  s.append(
    shape('path', 'mb-ridge', {
      d: `M${bx - 6},${by + 2} L${cx},${peak} L${bx + bw + 6},${by + 2}`,
    }),
  );
}

/** The standing silhouette group for a node — pure decoration, per estate art. */
function buildArt(nodeId: string, state: GameState): SVGSVGElement | null {
  const s = artSvg(150, 84);
  switch (nodeId) {
    case 'kura': {
      // the storehouse: fat body, hipped roof, one high window
      roofed(s, 46, 40, 68, 44, 16);
      s.append(shape('rect', 'mb-detail', { x: '70', y: '50', width: '18', height: '11' }));
      s.append(shape('path', 'mb-detail', { d: 'M46,72 h68' }));
      return s;
    }
    case 'gate-forecourt': {
      // the estate gate always stands; reopened house rooms add their forms
      const has = (id: string): boolean => state.unlocked.includes(id);
      if (has('house-workshops')) {
        s.append(shape('rect', 'mb-bldg', { x: '4', y: '66', width: '27', height: '18' }));
        s.append(shape('polygon', 'mb-roof', { points: '1,68 17.5,57 34,68' }));
        s.append(shape('path', 'mb-ridge', { d: 'M1,68 L17.5,57 L34,68' }));
      }
      if (has('house-omoya')) roofed(s, 30, 56, 66, 28, 28);
      if (has('house-study')) {
        s.append(shape('rect', 'mb-bldg', { x: '88', y: '42', width: '24', height: '15' }));
        s.append(shape('polygon', 'mb-roof', { points: '84,44 100,32 116,44' }));
        s.append(shape('path', 'mb-ridge', { d: 'M84,44 L100,32 L116,44' }));
        s.append(shape('circle', 'mb-detail', { cx: '100', cy: '49', r: '3.5' }));
      }
      if (has('house-granary')) {
        s.append(shape('rect', 'mb-trunk', { x: '78', y: '78', width: '4', height: '6' }));
        s.append(shape('rect', 'mb-trunk', { x: '100', y: '78', width: '4', height: '6' }));
        s.append(shape('rect', 'mb-bldg', { x: '74', y: '64', width: '34', height: '14' }));
        s.append(shape('polygon', 'mb-roof', { points: '70,66 91,52 112,66' }));
        s.append(shape('path', 'mb-ridge', { d: 'M70,66 L91,52 L112,66' }));
      }
      // the gate (mon): two posts + a tiled lintel roof — the front-right anchor
      s.append(shape('rect', 'mb-bldg', { x: '118', y: '50', width: '6', height: '34' }));
      s.append(shape('rect', 'mb-bldg', { x: '142', y: '50', width: '6', height: '34' }));
      s.append(shape('polygon', 'mb-roof', { points: '110,50 156,50 150,37 116,37' }));
      s.append(shape('path', 'mb-ridge', { d: 'M116,37 L150,37' }));
      return s;
    }
    case 'home-paddies': {
      // a field hut + seedling rows (the terraces live on the plate face)
      s.append(shape('rect', 'mb-bldg', { x: '120', y: '68', width: '24', height: '16' }));
      s.append(shape('polygon', 'mb-roof', { points: '115,70 132,57 149,70' }));
      s.append(shape('path', 'mb-ridge', { d: 'M115,70 L132,57 L149,70' }));
      for (const x of [26, 52, 78]) {
        s.append(shape('path', 'mb-detail', { d: `M${x - 5},84 L${x},75 L${x + 5},84` }));
      }
      return s;
    }
    case 'woodlot-edge': {
      // the long stable shed, trees crowding its back
      tree(s, 20, 34, 15);
      tree(s, 46, 42, 13);
      roofed(s, 74, 60, 68, 24, 42);
      s.append(shape('path', 'mb-detail', { d: 'M90,84 v-12 h14 v12' }));
      return s;
    }
    case 'near-satoyama': {
      tree(s, 34, 28, 16);
      tree(s, 80, 20, 18);
      tree(s, 126, 32, 15);
      return s;
    }
    case 'deep-satoyama': {
      tree(s, 16, 26, 14);
      tree(s, 48, 14, 17);
      tree(s, 80, 8, 19);
      tree(s, 112, 16, 17);
      tree(s, 144, 28, 14);
      return s;
    }
    case 'drill-yard': {
      // the weapon rack: posts, crossbars, a racked staff
      s.append(shape('rect', 'mb-bldg', { x: '52', y: '48', width: '4', height: '36' }));
      s.append(shape('rect', 'mb-bldg', { x: '118', y: '48', width: '4', height: '36' }));
      s.append(shape('rect', 'mb-bldg', { x: '48', y: '54', width: '78', height: '3' }));
      s.append(shape('rect', 'mb-bldg', { x: '48', y: '66', width: '78', height: '3' }));
      s.append(shape('path', 'mb-detail', { d: 'M60,62 L114,50' }));
      return s;
    }
    default:
      return null;
  }
}

// ── koma pieces ────────────────────────────────────────────────────────────
function koma(kanji: string, w: number, hgt: number, you: boolean): HTMLElement {
  const outer = h('div', `mb-koma${you ? ' mb-koma--you' : ''}`);
  outer.style.width = `${w}px`;
  outer.style.height = `${hgt}px`;
  const inner = h('div', 'mb-koma-in', kanji);
  inner.style.fontSize = `${Math.round(hgt * 0.46)}px`;
  outer.append(inner);
  return outer;
}
const CJK = /[　-鿿]/;
/** The koma's face glyph: the person's own first kanji if they carry one, else
 *  the mechanical role glyph (商 trader / 人 person) — never an invented name. */
function personKanji(name: string, trader: boolean): string {
  const c = name.trim().charAt(0);
  if (CJK.test(c)) return c;
  return trader ? '商' : '人';
}

// ── the module's slide memory (the player's koma walks between renders) ───
let lastHere: string | null = null;

// ── the take ───────────────────────────────────────────────────────────────
export function renderMapModelBoard(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
  void dispatch; // movement goes through ctx.move (the real move_to)
  ensureStyle();

  const depths = revealedDepths(ctx.revealed);
  const fog = fogFrontier(ctx.revealed);
  const craft = Math.min(4, Math.max(0, state.estateStage));

  // scale the fixed-geometry board into whatever column we were given
  const availW = container.clientWidth || 720;
  const scale = Math.min(1, availW / 790);
  const scene = h('div', 'mb-scene');
  for (let c = 1; c <= craft; c++) scene.classList.add(`mb-c${c}`);
  scene.style.height = `${Math.round(540 * scale)}px`;
  const persp = h('div', 'mb-persp');
  const board = h('div', 'mb-board');
  board.style.transform = `translate(-50%,-50%) scale(${scale.toFixed(3)}) rotateX(${TILT}deg) rotateZ(${SPIN}deg)`;

  // the ban's body: front + right edge quads, corner bolts
  board.append(h('div', 'mb-board-edge'), h('div', 'mb-board-edge mb-board-edge--l'));
  for (const [bx, by] of [
    [8, 8],
    [BOARD_W - 15, 8],
    [8, BOARD_H - 15],
    [BOARD_W - 15, BOARD_H - 15],
  ]) {
    const bolt = h('div', 'mb-bolt');
    bolt.style.left = `${bx}px`;
    bolt.style.top = `${by}px`;
    board.append(bolt);
  }

  // ── roads: inlaid tracks between adjacent plates (under the raised tiles) ──
  const roads = svgEl('svg');
  roads.setAttribute('class', 'mb-roads');
  roads.setAttribute('viewBox', `0 0 ${BOARD_W} ${BOARD_H}`);
  roads.setAttribute('width', String(BOARD_W));
  roads.setAttribute('height', String(BOARD_H));
  roads.setAttribute('aria-hidden', 'true');
  const drawRoad = (a: string, b: string, toFog: boolean): void => {
    const sa = TILES[a];
    const sb = TILES[b];
    if (!sa || !sb) return;
    const pa = px(sa);
    const pb = px(sb);
    const g = svgEl('g');
    g.setAttribute('class', toFog ? 'mb-road mb-road--fog' : 'mb-road');
    for (const cls of ['mb-road-groove', 'mb-road-inlay']) {
      const line = svgEl('line');
      line.setAttribute('class', cls);
      line.setAttribute('x1', String(pa.cx));
      line.setAttribute('y1', String(pa.cy));
      line.setAttribute('x2', String(pb.cx));
      line.setAttribute('y2', String(pb.cy));
      g.append(line);
    }
    roads.append(g);
  };
  for (const id of depths.keys()) {
    for (const nb of getNode(id).neighbors) {
      if (depths.has(nb) && id < nb) drawRoad(id, nb, false);
    }
  }
  for (const [id, from] of fog) drawRoad(from, id, true);
  board.append(roads);

  // ── the raised plate tiles ──
  const faceClass: Readonly<Record<string, string>> = {
    'home-paddies': ' mb-top--paddies',
    'gate-forecourt': ' mb-top--forecourt',
    'drill-yard': ' mb-top--drill',
    'near-satoyama': ' mb-top--near',
    'deep-satoyama': ' mb-top--deep',
  };
  const placeTile = (id: string): HTMLElement | null => {
    const spec = TILES[id];
    if (!spec) return null;
    const { cx, cy } = px(spec);
    const tile = h('div', 'mb-tile');
    tile.style.left = `${cx - spec.w / 2}px`;
    tile.style.top = `${cy - spec.hgt / 2}px`;
    tile.style.width = `${spec.w}px`;
    tile.style.height = `${spec.hgt}px`;
    board.append(tile);
    return tile;
  };

  for (const id of depths.keys()) {
    const tile = placeTile(id);
    if (!tile) continue;
    const node = getNode(id);
    const here = id === ctx.here;
    const nb = ctx.neighbours.some((n) => n.id === id);
    const gated = nb && node.dangerRing === true && !ctx.condOk;

    tile.append(h('div', 'mb-under'), h('div', 'mb-side'));
    const top = h('div', `mb-top${faceClass[id] ?? ''}`);
    tile.append(top);

    if (here) tile.classList.add('mb-tile--here');
    else if (gated) {
      tile.classList.add('mb-tile--gated');
      wireGated(tile, id, ctx);
      top.append(h('div', 'mb-gate-reason', `険 ${ctx.gateReason}`));
    } else if (nb) {
      tile.classList.add('mb-tile--live');
      wireTravel(tile, id, ctx);
      tile.setAttribute('aria-label', `Walk to ${node.label}`);
    } else tile.classList.add('mb-tile--dim');

    // flat marks on the plate face: labour (gold) + foes (muted vermillion)
    const marks = h('div', 'mb-marks');
    for (const act of ACTIVITIES) {
      if (act.area !== id || !isUnlocked(state, act.surface)) continue;
      const m = h('span', 'mb-lab', getSkill(act.skill).kanji);
      m.title = act.label;
      marks.append(m);
    }
    for (const mob of MOBS) {
      if (mob.area !== id || mob.scripted === true || (mob.minTier ?? 0) > state.tier) continue;
      const m = h('span', 'mb-foe', mob.kanji);
      m.title = mob.label;
      marks.append(m);
    }
    if (marks.childElementCount > 0) top.append(marks);

    // the standing silhouette (the model's cutout scenery)
    const art = buildArt(id, state);
    if (art) {
      const stand = h('div', 'mb-stand mb-art');
      const aw = Math.min(150, spec2w(id));
      art.setAttribute('width', String(aw));
      art.setAttribute('height', String(Math.round(aw * 0.56)));
      stand.append(art);
      tile.append(stand);
    }

    // the museum plaque: kanji + name (+ the 険 danger mark)
    const plaque = h('div', 'mb-stand mb-plaque');
    if (node.kanji) plaque.append(h('span', 'mb-plaque-kanji', node.kanji));
    plaque.append(h('span', 'mb-plaque-name', node.label));
    if (node.dangerRing) {
      // 険 stays a quiet ink-mark; it heats to vermillion only when the ring
      // is genuinely gating you right now (shu = real danger, never decor).
      const dm = h('span', `mb-plaque-danger${gated ? ' mb-plaque-danger--hot' : ''}`, '険');
      dm.title = gated ? ctx.gateReason : 'Danger ground';
      plaque.append(dm);
    }
    tile.append(plaque);

    // people standing here as small koma
    let pi = 0;
    for (const p of PEOPLE) {
      if (p.node !== id) continue;
      if (p.placeGate !== undefined && !isUnlocked(state, p.placeGate)) continue;
      if (p.presence !== undefined && !p.presence(state)) continue;
      const stand = h('div', 'mb-stand mb-person');
      stand.style.right = `${9 + pi * 18}%`;
      const piece = koma(personKanji(p.name, p.shopId !== undefined), 20, 26, false);
      piece.title = p.tell !== undefined ? `${p.name} — ${p.tell}` : p.name;
      stand.append(piece);
      tile.append(stand);
      pi++;
    }
  }

  // ── fog frontier: raw unshaped plates, a faint ？, never named ──
  for (const id of fog.keys()) {
    const tile = placeTile(id);
    if (!tile) continue;
    tile.classList.add('mb-tile--fog');
    tile.setAttribute('aria-hidden', 'true');
    tile.append(h('div', 'mb-side'));
    const top = h('div', 'mb-top');
    top.append(h('div', 'mb-fog-q', '？'));
    tile.append(top);
  }

  // ── the player's koma at you-are-here (slides on a real walk) ──
  const hereSpec = TILES[ctx.here];
  if (hereSpec) {
    const { cx, cy } = px(hereSpec);
    const pieceX = cx - hereSpec.w * 0.24;
    const pieceY = cy + hereSpec.hgt * 0.2;
    const piece = h('div', 'mb-piece');
    piece.style.left = `${pieceX}px`;
    piece.style.top = `${pieceY}px`;
    const slide = h('div', 'mb-piece-slide');
    slide.append(h('div', 'mb-piece-shadow'));
    const stand = h('div', 'mb-piece-stand');
    const you = koma('主', 28, 36, true);
    you.title = 'You are here';
    stand.append(you);
    slide.append(stand);
    piece.append(slide);
    board.append(piece);

    const prev = lastHere !== null && lastHere !== ctx.here ? TILES[lastHere] : undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prev && !reduced) {
      const pp = px(prev);
      const dx = pp.cx - prev.w * 0.24 - pieceX;
      const dy = pp.cy + prev.hgt * 0.2 - pieceY;
      slide.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0px, 0px)' }],
        { duration: 460, easing: 'cubic-bezier(0.3, 0.7, 0.3, 1)' },
      );
    }
  }
  lastHere = ctx.here;

  persp.append(board);
  scene.append(persp);
  container.append(scene);
  container.append(
    h('div', 'mb-caption', '模型 · the estate in miniature — click a plate to walk'),
  );
}

/** tile width lookup for the art sizing (kept tiny + total). */
function spec2w(id: string): number {
  const spec = TILES[id];
  return spec ? spec.w - 30 : 120;
}

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
import { isFogged, paintReveal, stageAtRung } from '../map-sheets/reveal';
import { attachSheetViewer } from '../map-sheets/viewer';
import { paintT0Ground } from '../map-sheets/t0-sheet';
import { gaitAt, PORTER_STAND_Y, walkPoint } from './porter-math';
import { buildPorter } from './porter-token';
import { fogFrontier, wireGated, wireTravel, type MapCtx } from './shared';

// ── FB-339 — the viewer interactions (zoom / pan / fit / full), ported from the DEV
//    survey viewer (map-sheets/sheet.ts). The view + maximize state live at MODULE level
//    so they survive the mapSignature rebuild and tab switches (TST2: the sheet never
//    snaps back under the player mid-look). null view = the default fit framing.
let mapView: { x: number; y: number; w: number; h: number } | null = null;
let mapMaxed = false;
/** The live sheet's exit-maximize hook — the one document-level Esc listener (installed
 *  once; renderMapSheet repoints it at each rebuild) calls through this. */
const exitMaxRef: { current: (() => void) | null } = { current: null };
let escWired = false;
/** FB-370 — the live sheet's height-cap re-measure, repointed each rebuild (one window
 *  resize listener, same install-once pattern as Esc). */
const capRef: { current: (() => void) | null } = { current: null };
let capWired = false;

// ── FB-340 (HR-26) — travel presence: footsteps + follow (the human-picked idiom). When a
//    move_to action STARTS, ink footprints stamp along the walked edge WHILE the sheet pans
//    your position to centre and a ring presses in on arrival — ALL synced to the move's
//    ActionClock timer (ADR-148), so the walk plays DURING the timer (never after) and arrives
//    exactly as it completes. render.ts fires it via `travelPresenceRef`; the `sample` thunk is
//    the clock's live fraction, so the animation respects pause / freeze / the speed multiplier.
/** The porter's FACING, preserved across sheet rebuilds (human, 2026-07-11: an arrival
 *  must keep the walk's direction — the resting mount snapping back east read as a
 *  jarring flip). 1 = east (the sculpt's native facing), -1 = west. Session-scoped. */
const porterFacingRef: { current: 1 | -1 } = { current: 1 };

/** The just-finished walk's footprint trail, handed ACROSS the arrival rebuild (human,
 *  2026-07-11: the overlay died with the swapped-out svg in one frame — a flash). The
 *  new sheet mounts these marks already fading (CSS-driven) and clears the ref. */
const trailAfterglowRef: {
  current: {
    marks: readonly { cx: number; cy: number; angle: string }[];
    p: number;
  } | null;
} = { current: null };

/** The shared footprint geometry — the walk overlay stamps these live; the afterglow
 *  re-mounts the same marks across the rebuild so the trail never pops. */
function footprintMarks(
  A: { x: number; y: number },
  B: { x: number; y: number },
): { cx: number; cy: number; angle: string }[] {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1);
  const N = 6;
  const out: { cx: number; cy: number; angle: string }[] = [];
  for (let i = 1; i <= N; i++) {
    const f = i / (N + 1);
    const side = i % 2 === 0 ? 1 : -1;
    out.push({
      cx: A.x + dx * f + nx * side * 14,
      cy: A.y + dy * f + ny * side * 14,
      angle,
    });
  }
  return out;
}

/** The live sheet's travel-presence player, repointed on every renderMapSheet. Null when no
 *  sheet is mounted. `sample()` yields the ActionClock's {fraction 0→1, running} for the move. */
export const travelPresenceRef: {
  current:
    | ((
        fromId: string,
        toId: string,
        sample: () => { fraction: number; running: boolean },
      ) => void)
    | null;
} = { current: null };

// ── FB-340 v2 (closes HR-26/HR-31) — the porter piece IS the presence (human-confirmed
//    2026-07-11): v1's shu rings + the DEV toggle are DELETED (ADR-075 zero flag-debt).

/** Mount the resting porter piece beside the zone anchor (south offset — the piece
 *  stands BESIDE the seal box, never behind the label). Display-only (TST4 position
 *  read; P15 — no destination preview, the piece exists only where you ARE). */
function mountRestingPorter(
  parent: SVGElement,
  x: number,
  y: number,
  tipText: string,
): void {
  const piece = buildPorter('rest');
  const flip = porterFacingRef.current < 0 ? ' scale(-1 1)' : '';
  piece.setAttribute(
    'transform',
    `translate(${x} ${y + PORTER_STAND_Y})${flip}`,
  );
  tip(piece, tipText);
  parent.append(piece);
}

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
      {
        x: String(x),
        y: String(y + 16),
        'text-anchor': 'middle',
        class: 'sheetmap-kanji',
      },
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
    // FB-340 v2 — the porter piece IS "you are here" (TST1: the ring's old home);
    // the seal keeps its shu stroke for far-zoom legibility (human call 2026-07-11).
    mountRestingPorter(g, x, y, 'You are here');
    tip(g, 'You are here');
  }
  seals.append(g);
  return g;
}

const CSS = `
  .sheetmap-print-fade { animation: sheetmapPrintFade 2200ms ease-out forwards; }
  @keyframes sheetmapPrintFade { from { opacity: 0.8; } to { opacity: 0; } }
  .sheetmap-wrap { width:100%; position:relative; overflow:hidden;
    user-select:none; -webkit-user-select:none; } /* drag-pan must never select SVG text */
  .sheetmap-wrap svg { display:block; width:100%; height:auto; background:var(--void);
    border:1px solid var(--silver-faint); cursor:grab; touch-action:none; }
  .sheetmap-wrap svg.sheetmap-panning { cursor:grabbing; }
  /* maximize: fill the viewport in NORMAL stacking (no Fullscreen top layer), so the
     backtick-capture overlay + pen still paint over the map (the sheet.ts lesson). */
  .sheetmap-wrap.sheetmap-max { position:fixed; inset:0; z-index:5000; background:var(--void); }
  .sheetmap-wrap.sheetmap-max svg { height:100%; border:none; }
  .sheetmap-controls { position:absolute; top:.5rem; right:.5rem; z-index:2;
    display:flex; gap:.2rem; }
  .sheetmap-zoom { font:12px/1.4 ui-monospace,SFMono-Regular,monospace; cursor:pointer;
    border:1px solid var(--silver-faint); border-radius:3px; padding:.15rem .5rem;
    background:var(--steel-2); color:var(--ink-soft); }
  .sheetmap-zoom:hover { color:var(--ink); border-color:var(--silver); }
  .sheetmap-hint { position:absolute; left:.6rem; bottom:.45rem; font-size:11px;
    color:var(--ink-faint); pointer-events:none; }
  /* the fine register FADES at the zoom gate (map-spec L10 — a hard display:none reads
     as a rendering glitch); visibility keeps hidden text unhittable once the fade lands */
  .ms-fine { transition: opacity .18s linear, visibility .18s linear; }
  svg[data-zoom='far'] .ms-fine { opacity:0; visibility:hidden; }
  .sheetmap-cartouche { font-family:var(--font-head); fill:var(--ink); }
  .sheetmap-kanji { font-family:var(--font-head); font-size:46px; fill:var(--ink); }
  .sheetmap-caption { font-family:var(--font-body); font-size:30px; fill:var(--ink);
    paint-order:stroke; stroke:var(--steel-1); stroke-width:6px; stroke-linejoin:round; }
  .sheetmap-node { outline:none; }
  .sheetmap-node[data-locked] { cursor:not-allowed; opacity:0.62; }
  .sheetmap-node[role="button"]:hover .sheetmap-sealbox,
  .sheetmap-node[role="button"]:focus-visible .sheetmap-sealbox {
    stroke:var(--gold-hi); stroke-width:3; }
  .sheetmap-fog { font-family:var(--font-head); font-size:34px; fill:var(--ink-faint); }
  .sheetmap-gate-why { font-family:var(--font-body); font-size:22px; fill:var(--ink-faint); }
  /* the reveal layer's ghost chips (未) ride paintReveal's shared class (FB-374) */
  .sheetmap-wrap .t0v2-kanji { font-family:var(--font-head); font-size:30px; fill:var(--ink); }
`;

/** Render the live estate map into `container` (the `.map-nav` host render.ts owns).
 *  `ctx` carries the here/revealed/neighbours/move seam; the seals dispatch the real move_to. */
export function renderMapSheet(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
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
  }) as SVGSVGElement;
  const art = sv('g');
  const seals = sv('g');
  svg.append(sv('defs'), art, seals);
  // FB (human, 2026-07-11) — the arrival afterglow: the walk's footprints survive the
  // rebuild and FADE (~2.2s, CSS-driven) instead of vanishing in one frame (the flash).
  // Only an ARRIVED walk (p ≥ 0.85) glows; a mid-walk repaint keeps its live overlay.
  const glow = trailAfterglowRef.current;
  trailAfterglowRef.current = null;
  if (glow && glow.p >= 0.85) {
    const trail = sv('g', {
      class: 'sheetmap-print-fade',
      'pointer-events': 'none',
    });
    for (const m of glow.marks) {
      trail.append(
        sv('ellipse', {
          cx: String(m.cx),
          cy: String(m.cy),
          rx: '15',
          ry: '7',
          transform: `rotate(${m.angle} ${m.cx} ${m.cy})`,
          fill: 'var(--shu)',
        }),
      );
    }
    trail.addEventListener('animationend', () => trail.remove(), {
      once: true,
    });
    seals.append(trail);
  }
  paintT0Ground(art, T0_WINDOW);

  // ── FB-374 — the ADR-151 fog of war, LIVE: unsurveyed paper masks the ground art at
  //    the nearest REVEAL stage at-or-below the player's rung (the same sparse-stage
  //    lookup the DEV previewer uses; placeholder geography, human-approved to ship).
  //    Seal gating stays core-`revealed`-driven — the fog only stops the DRAWING.
  const rungN = Number(state.rung.slice(1)) || 0;
  const revealStage = stageAtRung(rungN);
  paintReveal(svg, art, seals, revealStage);

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
  const isNeighbour = (id: string): boolean =>
    ctx.neighbours.some((n) => n.id === id);

  // (1) the surveyed zones + locked scenery — a seal each; travel where you may step.
  for (const node of MAP_NODES) {
    const a = ANCHORS[node.id];
    if (!a) continue;
    const here = node.id === ctx.here;
    if (node.locked) {
      // FB-380 — nothing under unsurveyed paper is previewed by name: while the
      // scenery's ground is fogged, its seal waits with the fog.
      if (isFogged(revealStage, a.x, a.y)) continue;
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
    if (!isSurveyed(node.id, revealed)) {
      // FB-376 (adjacent) — you can stand on unsurveyed ground (the cold open wakes you at
      // the kura before it's surveyed): your POSITION is always known to you (TST4), so the
      // porter draws even where the survey hasn't — just the piece, never the zone's seal
      // or name (reveal-as-plot holds).
      if (here) {
        mountRestingPorter(seals, a.x, a.y, 'You are here — unsurveyed ground');
      }
      continue;
    }
    const nb = isNeighbour(node.id);
    const gated = nb && !!node.dangerRing && !ctx.condOk;
    const walkable = nb && !gated && !here;
    const g = drawSeal(seals, node.id, a.x, a.y, {
      here,
      gated,
      walkable,
      locked: false,
    });
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
    } else if (!here) {
      // FB-341 — revealed but beyond one step: INERT. The pointer cursor + gold
      // hover belong to wireTravel'd seals only; a far seal must read disabled,
      // never clickable-but-dead (its dim silver-wire stroke stays as drawn).
      asHtml.dataset.far = node.id;
      asHtml.setAttribute('aria-disabled', 'true');
    }
  }

  // (2) the fog frontier — unsurveyed ground one step past a revealed node: an unnamed 未測 wash
  //     (reveal-as-plot — never name it). Locked scenery is not fog (it's drawn above).
  for (const id of fogFrontier(revealed).keys()) {
    if (getNode(id).locked) continue;
    const a = ANCHORS[id];
    if (!a) continue;
    // FB-392/FB-394/FB-397 (w1 drain, 2026-07-11) — a frontier whose anchor sits under
    // the rung's fog stays a SECRET: no 未測 wash floating on the fog wash.
    if (isFogged(revealStage, a.x, a.y)) continue;
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

  // ── FB-339 — the view: the SHARED sheet-viewer engine (map-sheets/viewer.ts —
  //    one engine for the DEV viewers and this live map). The persisted mapView
  //    re-applies across the sig-guard rebuild; seal clicks stay live because the
  //    engine captures the pointer only once a REAL drag starts.
  const FR = T0_WINDOW;
  // FB-374 — the DEFAULT framing opens on the surveyed ground (the reveal stage's known
  // polygon, padded, stretched to the frame's aspect and always including where you stand),
  // not the full-sheet fit: at early rungs the known world is small — open on IT. A
  // user-chosen view (mapView) always wins (TST2); ⤢ fit still gives the whole sheet.
  const defaultVb = (): { x: number; y: number; w: number; h: number } => {
    if (!revealStage?.known) return { ...FR };
    const hereA = ANCHORS[ctx.here];
    const xs = revealStage.known
      .map((p) => p[0])
      .concat(hereA ? [hereA.x] : []);
    const ys = revealStage.known
      .map((p) => p[1])
      .concat(hereA ? [hereA.y] : []);
    const pad = 90;
    let x = Math.min(...xs) - pad;
    let y = Math.min(...ys) - pad;
    let w = Math.max(...xs) - Math.min(...xs) + pad * 2;
    let h = Math.max(...ys) - Math.min(...ys) + pad * 2;
    const ar = FR.h / FR.w; // grow to the frame's aspect so clamping never distorts
    if (h / w > ar) {
      const nw = h / ar;
      x -= (nw - w) / 2;
      w = nw;
    } else {
      const nh = w * ar;
      y -= (nh - h) / 2;
      h = nh;
    }
    // the DEFAULT frame stays strictly on the sheet — aspect growth must not slide the
    // view past the window edge onto beyond-the-frame world art (panning there is the
    // player's own choice; opening there is a leak).
    x = Math.min(Math.max(x, FR.x), FR.x + Math.max(0, FR.w - w));
    y = Math.min(Math.max(y, FR.y), FR.y + Math.max(0, FR.h - h));
    w = Math.min(w, FR.w);
    h = Math.min(h, FR.h);
    return { x, y, w, h };
  };
  const viewer = attachSheetViewer(svg, FR, {
    panningClass: 'sheetmap-panning',
    initialVb: mapView ?? defaultVb(),
    onApply: (v) => {
      mapView = { ...v };
    },
  });
  const vb = viewer.vb;
  const applyVb = viewer.applyVb;
  const clampVb = viewer.clampVb;
  const fit = viewer.fit;
  const controls = document.createElement('div');
  controls.className = 'sheetmap-controls';
  const zoomBtn = (
    label: string,
    act: () => void,
    aria: string,
  ): HTMLButtonElement => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sheetmap-zoom';
    b.textContent = label;
    b.setAttribute('aria-label', aria);
    b.addEventListener('click', () => act());
    controls.append(b);
    return b;
  };
  zoomBtn('⊕', () => viewer.zoomCentre(1 / 1.35), 'Zoom in');
  zoomBtn('⊖', () => viewer.zoomCentre(1.35), 'Zoom out');
  zoomBtn('⤢ fit', fit, 'Fit the whole sheet');
  // Maximize the sheet to fill the viewport — a CSS blow-up in NORMAL stacking (not the
  // native Fullscreen API), so the capture overlay keeps painting above it. Survives the
  // sig-guard rebuild via the module flag; exits on the button or Esc.
  const fsBtn = zoomBtn(
    mapMaxed ? '⛶ exit' : '⛶ full',
    () => setMax(!mapMaxed),
    'Full-screen the map',
  );
  const setMax = (on: boolean): void => {
    mapMaxed = on;
    wrap.classList.toggle('sheetmap-max', on);
    fsBtn.textContent = on ? '⛶ exit' : '⛶ full';
    capRef.current?.(); // maximize owns the height; the cap re-applies on exit (FB-370)
  };
  exitMaxRef.current = (): void => setMax(false);
  if (!escWired) {
    escWired = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mapMaxed) exitMaxRef.current?.();
    });
  }
  const hint = document.createElement('div');
  hint.className = 'sheetmap-hint';
  hint.textContent = 'drag to pan · scroll to zoom';
  if (mapMaxed) wrap.classList.add('sheetmap-max');
  applyVb();

  container.append(style, wrap);
  wrap.append(svg, controls, hint);

  // ── FB-370 — cap the sheet's CSS box to the VISIBLE pane. `width:100%; height:auto`
  //    sized the svg from width alone (3:2 window aspect), so on a wide-short viewport
  //    the sheet ran ~280px past the fold and the walkable seals sat below it; the ⤢ fit
  //    button resets the viewBox, never the CSS box. The wrap is sized to the sheet's OWN
  //    aspect at whichever of width/available-height binds — never letterboxed (an svg
  //    paints beyond-viewBox art into letterbox bands, leaking unrevealed world ground).
  //    Measured live (the chrome above the pane changes — FB-372 just retired the
  //    titlebar), re-measured on window resize.
  const cap = (): void => {
    if (mapMaxed) {
      wrap.style.width = '';
      wrap.style.margin = '';
      return;
    }
    const top = wrap.getBoundingClientRect().top;
    const foot =
      document.querySelector('.appbar-footer')?.getBoundingClientRect()
        .height ?? 0;
    // FB-377 — a touch more air below the sheet (26, was 14); the sheet PINS top-left
    // (margin 0, not auto-centred) so the you-are-here card floats in the right column.
    const availH = Math.max(
      240,
      Math.round(window.innerHeight - top - foot - 26),
    );
    const hostW = container.clientWidth || wrap.clientWidth || FR.w;
    const w = Math.min(hostW, Math.round((availH * FR.w) / FR.h));
    wrap.style.width = `${w}px`;
    wrap.style.margin = '0';
  };
  capRef.current = cap;
  if (!capWired) {
    capWired = true;
    window.addEventListener('resize', () => capRef.current?.());
  }
  cap();

  // ── FB-340 (HR-26) — arm the travel-presence player for THIS sheet. render.ts fires it the
  //    instant a move_to action STARTS, so the footsteps + follow play DURING the move's
  //    ActionClock timer (synced to it), not after. A save-load / teleport never presses a
  //    timed move, so it never animates a non-walk (P14 — a live response to the player's move).
  travelPresenceRef.current = (fromId, toId, sample) => {
    const fa = ANCHORS[fromId];
    const ta = ANCHORS[toId];
    if (fa === undefined || ta === undefined || import.meta.env.MODE === 'test')
      return;
    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // P12 — reduced-motion: no footsteps; the view simply follows to centre for the arrival.
      vb.x = ta.x - vb.w / 2;
      vb.y = ta.y - vb.h / 2;
      clampVb();
      applyVb();
      return;
    }
    runFootstepsFollow(svg, fa, ta, { vb, clampVb, applyVb }, sample);
  };
}

/** FB-340 (HR-26) — the travel presence: ink footprints stamp along the walked edge WHILE the
 *  sheet pans your position to centre and a destination ring presses in, ALL synced to the move
 *  timer. `sample()` yields the ActionClock's live {fraction 0→1, running}; the animation reads
 *  it each frame, so the walk's speed exactly matches the timer, it pauses/freezes with the clock,
 *  and it arrives as the timer completes. The prints live in SVG user-space, so they ride the
 *  panning viewBox. Aborts the instant the sheet is replaced (svg.isConnected — TST2). */
function runFootstepsFollow(
  svg: SVGElement,
  from: { readonly x: number; readonly y: number },
  to: { readonly x: number; readonly y: number },
  view: {
    vb: { x: number; y: number; w: number; h: number };
    clampVb: () => void;
    applyVb: () => void;
  },
  sample: () => { fraction: number; running: boolean },
): void {
  const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
  const ease = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  // you are leaving `from`: hide its resting piece for the transit; restore it if the
  // move is cancelled (on completion the sheet rebuilds with the piece already at `to`).
  const resting = svg.querySelector<SVGElement>('.sheetmap-porter');
  if (resting) resting.style.opacity = '0';
  const overlay = sv('g', {
    class: 'sheetmap-presence',
    'pointer-events': 'none',
  });
  svg.append(overlay);
  const done = (): void => {
    overlay.remove();
    if (resting) resting.removeAttribute('style'); // un-hide (move cancelled → stay at `from`)
  };

  // v2 — the piece walks the STANDING lane (the south offset it rests at), so it departs
  // from exactly where it stood and settles exactly where the completion rebuild mounts it:
  // the arrival IS the settle (the v1 destination press-in ring is dropped — human call).
  const A = { x: from.x, y: from.y + PORTER_STAND_Y };
  const B = { x: to.x, y: to.y + PORTER_STAND_Y };
  const dx = B.x - A.x;
  const marks = footprintMarks(A, B);
  const N = marks.length;
  const feet: SVGElement[] = marks.map((m) => {
    const foot = sv('ellipse', {
      cx: String(m.cx),
      cy: String(m.cy),
      rx: '15',
      ry: '7',
      transform: `rotate(${m.angle} ${m.cx} ${m.cy})`,
      fill: 'var(--shu)',
      opacity: '0',
    });
    overlay.append(foot);
    return foot;
  });
  // the walk's direction is STATE (human, 2026-07-11): the resting mount keeps it on
  // arrival (no snap-flip east), and the trail survives the arrival rebuild as a fade.
  if (dx !== 0) porterFacingRef.current = dx < 0 ? -1 : 1;
  // the walking piece itself: departs the standing lane at `from`, arrives at the exact
  // spot the completion rebuild mounts the resting piece (the settle IS the arrival beat —
  // human call, 2026-07-11). Faces its travel direction (the sculpt faces east; a westward
  // walk mirrors it about the feet).
  const walker = buildPorter('walk');
  const flip = dx < 0 ? ' scale(-1 1)' : '';
  walker.setAttribute('transform', `translate(${A.x} ${A.y})${flip}`);
  overlay.append(walker);

  const sx = view.vb.x;
  const sy = view.vb.y;
  const txx = to.x - view.vb.w / 2;
  const tyy = to.y - view.vb.h / 2;
  const LAY = 0.85; // the trail lays down over the first 85% of the walk; the ring settles by the end
  const step = (now: number): void => {
    if (!svg.isConnected) return; // a rebuild replaced this sheet mid-walk — stop cold (TST2)
    const s = sample();
    const p = clamp01(s.fraction);
    // hand the trail across the ARRIVAL rebuild (which kills this loop cold): keep the
    // ref fresh each frame; renderMapSheet mounts the afterglow when p arrived (≥0.85).
    trailAfterglowRef.current = { marks, p };
    // the sheet follows the walk fraction — arriving exactly as the timer completes
    const e = ease(p);
    view.vb.x = sx + (txx - sx) * e;
    view.vb.y = sy + (tyy - sy) * e;
    view.clampVb();
    view.applyVb();
    // footprints stamp in walking order across the walk; each fades in when the walk reaches it
    feet.forEach((foot, i) => {
      const born = (i / N) * LAY;
      foot.setAttribute(
        'opacity',
        p < born ? '0' : String(Math.min(0.8, ((p - born) / 0.12) * 0.8)),
      );
    });
    // the piece walks the edge LINEARLY at the clock's own pace (the human ask); the
    // netsuke waddle plays only while the clock runs (a pause freezes mid-stride).
    const pos = walkPoint(A, B, p);
    const g = s.running && p < 1 ? gaitAt(now) : { bob: 0, rock: 0 };
    walker.setAttribute(
      'transform',
      `translate(${pos.x} ${pos.y + g.bob})${flip} rotate(${g.rock})`,
    );
    if (s.running && p < 1) requestAnimationFrame(step);
    else done();
  };
  requestAnimationFrame(step);
}

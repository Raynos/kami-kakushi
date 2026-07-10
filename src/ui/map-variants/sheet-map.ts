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

// ── FB-340 — travel presence: the marker + the move animation, played when a rebuild is a
//    COMPLETED walk (here changed to an adjacent node — a load/teleport never animates).
//    Three diverged idioms (ADR-075): 'glide' (A, ships) — the vermilion ring travels the
//    walked edge; 'steps' (B) — ink footprints stamp along it, the ring presses in;
//    'follow' (C) — the ring presses in and the VIEW pans your position back to centre.
export type TravelPresence = 'glide' | 'steps' | 'follow';
let prevHere: string | null = null;

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
        class: 'sheetmap-here-ring', // FB-340 — the presence layer animates THIS ring (P2)
      }),
    );
    tip(g, 'You are here');
  }
  seals.append(g);
  return g;
}

const CSS = `
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
`;

/** Render the live estate map into `container` (the `.map-nav` host render.ts owns).
 *  `ctx` carries the here/revealed/neighbours/move seam; the seals dispatch the real move_to. */
export function renderMapSheet(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
  presence: TravelPresence = 'glide', // FB-340 — 'glide' ships; B/C only reachable from dev.ts
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

  // ── FB-339 — the view: pan (drag) + zoom (wheel / pinch / buttons) + fit + full,
  //    viewBox-driven, ported from the DEV survey viewer (map-sheets/sheet.ts). The
  //    persisted mapView re-applies across the sig-guard rebuild; seal clicks stay
  //    live because the pointer is captured only once a REAL drag starts.
  const FR = T0_WINDOW;
  const vb: { x: number; y: number; w: number; h: number } = { ...(mapView ?? FR) };
  const applyVb = (): void => {
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    // the fine-detail register reveals past the zoom gate (map-spec L10)
    svg.setAttribute('data-zoom', vb.w <= FR.w * 0.62 ? 'near' : 'far');
    mapView = { ...vb };
  };
  const clampVb = (): void => {
    vb.w = Math.min(Math.max(vb.w, 320), FR.w * 1.15);
    vb.h = (vb.w * FR.h) / FR.w;
    const m = vb.w * 0.25; // let the sheet edge pull in a bit, never lose it
    vb.x = Math.min(Math.max(vb.x, FR.x - m), FR.x + FR.w + m - vb.w);
    vb.y = Math.min(
      Math.max(vb.y, FR.y - (m * FR.h) / FR.w),
      FR.y + FR.h + (m * FR.h) / FR.w - vb.h,
    );
  };
  /** client → world coords (getScreenCTM handles viewBox + letterboxing). Guarded for
   *  jsdom, which implements neither getScreenCTM nor DOMPoint — the full-mount test
   *  sweeps click the zoom buttons, and an unguarded call is a TypeError there. */
  const toWorld = (cx: number, cy: number): { x: number; y: number } => {
    const g = svg as unknown as SVGGraphicsElement;
    if (typeof g.getScreenCTM !== 'function' || typeof DOMPoint === 'undefined')
      return { x: 0, y: 0 };
    const m = g.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const zoomAt = (cx: number, cy: number, factor: number): void => {
    const p = toWorld(cx, cy);
    vb.w *= factor;
    vb.h *= factor;
    clampVb();
    applyVb();
    // keep the world point under the cursor stationary: re-measure and shift
    const now = toWorld(cx, cy);
    vb.x += p.x - now.x;
    vb.y += p.y - now.y;
    clampVb();
    applyVb();
  };
  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 1.18 : 1 / 1.18);
    },
    { passive: false },
  );
  let dragging = false;
  let dragMoved = false;
  let dragStart = { x: 0, y: 0 };
  // live pointers — two fingers = pinch zoom. touch-action:none means WE own every
  // gesture (the DEV viewer's G-9 lesson); gestures here must match that viewer's.
  const pointers = new Map<number, { x: number; y: number }>();
  let pinchDist = 0;
  svg.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      dragging = false; // a second finger ends the pan; the gesture is a pinch
      svg.classList.remove('sheetmap-panning');
      return;
    }
    dragging = true;
    dragMoved = false;
    dragStart = toWorld(e.clientX, e.clientY);
    svg.classList.add('sheetmap-panning');
  });
  svg.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      if (pinchDist > 0 && d > 0) {
        // zoom about the finger midpoint; zoomAt keeps that world point still
        zoomAt((a!.x + b!.x) / 2, (a!.y + b!.y) / 2, pinchDist / d);
      }
      pinchDist = d;
      return;
    }
    if (!dragging) return;
    const p = toWorld(e.clientX, e.clientY);
    const dx = dragStart.x - p.x;
    const dy = dragStart.y - p.y;
    if (!dragMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      dragMoved = true;
      // capture only once a REAL drag starts — capturing on pointerdown would
      // retarget the derived click to the svg and seal travel would go dead
      // (guarded: jsdom has no setPointerCapture)
      if (typeof svg.setPointerCapture === 'function') svg.setPointerCapture(e.pointerId);
    }
    if (!dragMoved) return;
    vb.x += dx;
    vb.y += dy;
    clampVb();
    applyVb();
  });
  const endDrag = (e: PointerEvent): void => {
    pointers.delete(e.pointerId);
    pinchDist = 0;
    dragging = false;
    svg.classList.remove('sheetmap-panning');
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  const fit = (): void => {
    Object.assign(vb, FR);
    applyVb();
  };
  const controls = document.createElement('div');
  controls.className = 'sheetmap-controls';
  const zoomBtn = (label: string, act: () => void, aria: string): HTMLButtonElement => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sheetmap-zoom';
    b.textContent = label;
    b.setAttribute('aria-label', aria);
    b.addEventListener('click', () => act());
    controls.append(b);
    return b;
  };
  const centre = (): { x: number; y: number } => {
    const r = svg.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  zoomBtn(
    '⊕',
    () => {
      const c = centre();
      zoomAt(c.x, c.y, 1 / 1.35);
    },
    'Zoom in',
  );
  zoomBtn(
    '⊖',
    () => {
      const c = centre();
      zoomAt(c.x, c.y, 1.35);
    },
    'Zoom out',
  );
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

  // ── FB-340 — play the travel presence when THIS rebuild completed a walk: here changed,
  //    and from an ADJACENT node (a save-load / teleport is never a walk, so never animates).
  //    One-shot, a live response to the player's own move (P14); reduced-motion → instant (P12).
  const from = prevHere;
  prevHere = ctx.here;
  const fa = from !== null ? ANCHORS[from] : undefined;
  const ta = ANCHORS[ctx.here];
  const walked =
    from !== null &&
    from !== ctx.here &&
    fa !== undefined &&
    ta !== undefined &&
    getNode(ctx.here).neighbors.includes(from);
  if (!walked || import.meta.env.MODE === 'test') return;
  const reduced =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    // instant, never omitted: the static ring is already drawn; C still recentres, sans glide.
    if (presence === 'follow') {
      vb.x = ta.x - vb.w / 2;
      vb.y = ta.y - vb.h / 2;
      clampVb();
      applyVb();
    }
    return;
  }
  runPresence(presence, svg, fa!, ta, { vb, clampVb, applyVb });
}

/** The FB-340 presence animations. All three drive the ONE here-ring idiom (P2) with a
 *  rAF timeline that aborts the moment the sheet is replaced (svg.isConnected — TST2). */
function runPresence(
  mode: TravelPresence,
  svg: SVGElement,
  from: { readonly x: number; readonly y: number },
  to: { readonly x: number; readonly y: number },
  view: {
    vb: { x: number; y: number; w: number; h: number };
    clampVb: () => void;
    applyVb: () => void;
  },
): void {
  const ring = svg.querySelector<SVGCircleElement>('.sheetmap-here-ring');
  const overlay = sv('g', { class: 'sheetmap-presence', 'pointer-events': 'none' });
  svg.append(overlay);
  const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const done = (): void => {
    overlay.remove();
    if (ring) {
      ring.removeAttribute('style');
      ring.setAttribute('r', '92');
    }
  };
  const animate = (durMs: number, frame: (t: number) => void, end: () => void): void => {
    const t0 = performance.now();
    const step = (now: number): void => {
      if (!svg.isConnected) return; // a rebuild replaced this sheet mid-flight — stop cold
      const t = Math.min(1, (now - t0) / durMs);
      frame(t);
      if (t < 1) requestAnimationFrame(step);
      else end();
    };
    requestAnimationFrame(step);
  };
  /** The hanko press: the ring settles from wide+faint to its resting stamp. */
  const press = (t: number): void => {
    if (!ring) return;
    const p = Math.min(1, t);
    ring.style.opacity = String(0.85 * p);
    ring.setAttribute('r', String(92 + 36 * (1 - ease(p))));
  };

  if (mode === 'glide') {
    // A — the seal glides: ring + plumb dot travel the walked edge; a dashed ink line
    // draws the walk and fades once the seal has settled.
    if (ring) ring.style.opacity = '0';
    const line = sv('line', {
      x1: String(from.x),
      y1: String(from.y),
      x2: String(to.x),
      y2: String(to.y),
      stroke: 'var(--shu)',
      'stroke-width': '2.5',
      'stroke-dasharray': '10 9',
      opacity: '0.35',
    });
    const tRing = sv('circle', {
      r: '92',
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': '2',
      opacity: '0.85',
    });
    const tDot = sv('circle', { r: '9', fill: 'var(--shu)', opacity: '0.9' });
    overlay.append(line, tRing, tDot);
    animate(
      650,
      (t) => {
        const e = ease(t);
        const x = from.x + (to.x - from.x) * e;
        const y = from.y + (to.y - from.y) * e;
        for (const c of [tRing, tDot]) {
          c.setAttribute('cx', String(x));
          c.setAttribute('cy', String(y));
        }
      },
      () => {
        if (ring) ring.style.opacity = '0.85';
        tRing.remove();
        tDot.remove();
        animate(420, (t) => line.setAttribute('opacity', String(0.35 * (1 - t))), done);
      },
    );
    return;
  }

  if (mode === 'steps') {
    // B — ink footsteps: alternating brush dabs stamp along the walked edge, then the
    // ring presses in at the destination like a hanko; the prints weather away after.
    if (ring) ring.style.opacity = '0';
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len;
    const py = dx / len;
    const angle = ((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1);
    const N = 6;
    const feet: SVGElement[] = [];
    for (let i = 1; i <= N; i++) {
      const t = i / (N + 1);
      const side = i % 2 === 0 ? 1 : -1;
      const cx = from.x + dx * t + px * side * 14;
      const cy = from.y + dy * t + py * side * 14;
      const f = sv('ellipse', {
        cx: String(cx),
        cy: String(cy),
        rx: '15',
        ry: '7',
        transform: `rotate(${angle} ${cx} ${cy})`,
        fill: 'var(--shu)',
        opacity: '0',
      });
      overlay.append(f);
      feet.push(f);
    }
    const stepMs = 110;
    const pressAt = N * stepMs + 120;
    const total = pressAt + 260 + 420;
    animate(
      total,
      (t) => {
        const ms = t * total;
        feet.forEach((f, i) => {
          const born = (i + 1) * stepMs;
          if (ms < born) return;
          const inO = Math.min(0.75, ((ms - born) / 140) * 0.75);
          const fade = ms > pressAt + 260 ? Math.max(0, 1 - (ms - pressAt - 260) / 420) : 1;
          f.setAttribute('opacity', String(inO * fade));
        });
        if (ms >= pressAt) press((ms - pressAt) / 260);
      },
      done,
    );
    return;
  }

  // C — the sheet walks with you: the ring presses in where you now stand, and the VIEW
  // pans so that spot glides back to centre — at the player's own zoom, never resetting it.
  if (ring) ring.style.opacity = '0';
  const sx = view.vb.x;
  const sy = view.vb.y;
  const txx = to.x - view.vb.w / 2;
  const tyy = to.y - view.vb.h / 2;
  animate(
    700,
    (t) => {
      const e = ease(t);
      view.vb.x = sx + (txx - sx) * e;
      view.vb.y = sy + (tyy - sy) * e;
      view.clampVb();
      view.applyVb();
      press(t / 0.4);
    },
    done,
  );
}

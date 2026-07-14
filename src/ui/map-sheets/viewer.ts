// map-sheets/viewer.ts — the ONE sheet-viewer interaction engine (2026-07-11
// human steer: one engine, one source of truth). Both consumers — the DEV
// survey viewer (sheet.ts) and the live Map tab (map-variants/sheet-map.ts) —
// were carrying near-verbatim copies of this stack, already drifting (jsdom
// guards + view persistence only in the live copy, zoom-time filter suspension
// only in the DEV copy). The engine is the superset; each caller keeps only
// its own chrome (buttons, CSS class names, maximize wiring, default framing).
//
// Behaviour it owns, verbatim from the shipped copies:
// - viewBox state + clamp (min width 320 · max 1.15× frame · 25% edge slack)
// - the `data-zoom` near/far LOD gate at 0.62× (map-spec L10)
// - wheel zoom about the cursor; ⊕/⊖ zoom about the pane centre (zoomAt)
// - drag-pan with LATE pointer capture (capturing on pointerdown would
//   retarget the derived click and seal/node selection would go dead)
// - two-finger pinch about the finger midpoint (touch-action:none — G-9)
// - client→world via getScreenCTM, guarded for jsdom (no getScreenCTM /
//   DOMPoint there — the full-mount test sweeps click the zoom buttons)

export interface SheetFrame {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface SheetVb {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SheetViewerOpts {
  /** CSS class toggled on the svg while a drag-pan is live. */
  readonly panningClass: string;
  /** Opening view; defaults to the full frame. */
  readonly initialVb?: SheetVb;
  /** Called after every applyVb — the live map persists the view here. */
  readonly onApply?: (vb: Readonly<SheetVb>) => void;
  /** DEV viewer perf: suspend the paper-warp filter on this group while
   *  zooming (the browser re-rasterises the filtered group at each scale —
   *  measured 24ms→14ms p50), restoring it on idle. */
  readonly filterGroup?: () => SVGElement | null;
}

export interface SheetViewer {
  /** The live viewBox — callers may mutate it, then call clampVb + applyVb. */
  readonly vb: SheetVb;
  applyVb(): void;
  clampVb(): void;
  /** Zoom by `factor` keeping the world point under (cx,cy) stationary. */
  zoomAt(cx: number, cy: number, factor: number): void;
  /** Zoom about the pane centre — the ⊕/⊖ buttons. */
  zoomCentre(factor: number): void;
  /** Reset to the full frame. */
  fit(): void;
  /** Fly to a world point at view width `w` (roster navigation). */
  focusAt(x: number, y: number, w: number): void;
  /** client → world coords (jsdom-safe). */
  toWorld(cx: number, cy: number): { x: number; y: number };
  /** Did the last pointer sequence actually pan? (a pan that ends on a node
   *  is not a selection — callers guard their click handlers with this) */
  panned(): boolean;
  /** Clear pending timers — call when the sheet is torn down (never restore
   *  a suspended filter onto a removed sheet). */
  dispose(): void;
}

/** Wire the shared pan/zoom/pinch/fit engine onto `svg`, viewBox-driven. */
export function attachSheetViewer(
  svg: SVGSVGElement,
  FR: SheetFrame,
  opts: SheetViewerOpts,
): SheetViewer {
  const vb: SheetVb = { ...(opts.initialVb ?? FR) };
  const applyVb = (): void => {
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    // the fine-detail register reveals past the zoom gate (map-spec L10)
    svg.setAttribute('data-zoom', vb.w <= FR.w * 0.62 ? 'near' : 'far');
    opts.onApply?.(vb);
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
  const toWorld = (cx: number, cy: number): { x: number; y: number } => {
    const g = svg as unknown as SVGGraphicsElement;
    if (typeof g.getScreenCTM !== 'function' || typeof DOMPoint === 'undefined')
      return { x: 0, y: 0 };
    const m = g.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  // zoom-time filter suspension (crisp warp at rest, 60fps in motion)
  let artFilter: string | null = null;
  let filterIdle: ReturnType<typeof setTimeout> | undefined;
  const suspendFilterForZoom = (): void => {
    if (!opts.filterGroup) return;
    const art = opts.filterGroup();
    if (art && artFilter === null) {
      artFilter = art.getAttribute('filter');
      if (artFilter) art.removeAttribute('filter');
    }
    clearTimeout(filterIdle);
    filterIdle = setTimeout(() => {
      const a = opts.filterGroup?.();
      if (a && artFilter) a.setAttribute('filter', artFilter);
      artFilter = null;
    }, 160);
  };

  const zoomAt = (cx: number, cy: number, factor: number): void => {
    suspendFilterForZoom();
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
  // live pointers — two fingers = pinch zoom. touch-action:none means WE own
  // every gesture (G-9); one engine keeps DEV + live gestures identical.
  const pointers = new Map<number, { x: number; y: number }>();
  let pinchDist = 0;
  svg.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      dragging = false; // a second finger ends the pan; the gesture is a pinch
      svg.classList.remove(opts.panningClass);
      return;
    }
    dragging = true;
    dragMoved = false;
    dragStart = toWorld(e.clientX, e.clientY);
    svg.classList.add(opts.panningClass);
  });
  svg.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId))
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
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
      // capture only once a REAL drag starts (guarded: jsdom has no
      // setPointerCapture)
      if (typeof svg.setPointerCapture === 'function')
        svg.setPointerCapture(e.pointerId);
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
    svg.classList.remove(opts.panningClass);
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  const centre = (): { x: number; y: number } => {
    const r = svg.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const viewer: SheetViewer = {
    vb,
    applyVb,
    clampVb,
    zoomAt,
    zoomCentre: (factor) => {
      const c = centre();
      zoomAt(c.x, c.y, factor);
    },
    fit: () => {
      Object.assign(vb, FR);
      applyVb();
    },
    focusAt: (x, y, w) => {
      vb.w = w;
      vb.h = (w * FR.h) / FR.w;
      vb.x = x - vb.w / 2;
      vb.y = y - vb.h / 2;
      clampVb();
      applyVb();
    },
    toWorld,
    panned: () => dragMoved,
    dispose: () => clearTimeout(filterIdle),
  };
  applyVb();
  return viewer;
}

// stamp-book/book.ts — the E3 graphics-exploration DEV prototype (#8 shuinchō
// stamp book ❤️ + #10 ink thread, folded together per the 2026-07-08 triage):
// a pilgrimage stamp book whose pages carry one pressed seal per rung ceremony,
// strung on the run's single ink-thread brushstroke — knots at crises, thin dry
// passages through lean stretches. Drawn ENTIRELY by code from the static
// fixture history (fixture.ts): seeded-deterministic, Andon tokens only, brush
// primitives from map-sheets/brush.ts. DEV-only (imported by ui/dev.ts alone,
// riding its strip fold); ZERO game integration — the prototype-first law
// (docs/plans/fable-2026-07-08-graphics-explorations.md).
//
// Genre notes (the anti-slop constraint): a shuinchō reads RIGHT → LEFT — the
// cover is the rightmost panel and the book opens scrolled to it. The thread is
// inked stretch by stretch, each stroke lifting INTO a seal; every joint is
// pressed over by its stamp, so the thread reads as one continuous stroke.

import { brushStroke, inkLine, rng, scrawl, stipple, sv, tip, wash } from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';
import { OWNER, STAMPS, THREAD_MARKS } from './fixture';
import type { StampEvent } from './fixture';

const PAGE_W = 400;
const PAGE_H = 620;
/** cover + one page per stamp */
const PAGES = STAMPS.length + 1;
const BOOK_W = PAGES * PAGE_W;

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

/** Ink text with a choosable font register (brush.inkText is head-font only). */
function txt(
  parent: SVGElement,
  x: number,
  y: number,
  text: string,
  o: {
    size: number;
    color: string;
    font?: 'head' | 'body';
    vertical?: boolean;
    anchor?: 'start' | 'middle' | 'end';
    opacity?: number;
  },
): SVGTextElement {
  const t = sv(
    'text',
    {
      x: String(x),
      y: String(y),
      'text-anchor': o.anchor ?? 'middle',
      style:
        `font-family:var(--font-${o.font ?? 'head'});font-size:${o.size}px;` +
        `fill:${o.color};` +
        (o.vertical ? 'writing-mode:vertical-rl;' : ''),
      ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
    },
    text,
  );
  parent.append(t);
  return t;
}

/** Page slot s (0 = the cover, rightmost) → the panel's left x. */
function pageX(slot: number): number {
  return BOOK_W - (slot + 1) * PAGE_W;
}

// ── the stamp ─────────────────────────────────────────────────────────────────

/** Press one rung seal: a hand-rotated vermillion frame + carved center glyph,
 *  with paper-coloured press-patchiness eating into the ink. Drawn OVER the
 *  thread so the seal covers its stroke joint. */
function pressStamp(
  parent: SVGElement,
  cx: number,
  cy: number,
  size: number,
  ev: StampEvent,
  pageFill: string,
): void {
  const r = rng(`stamp-${ev.id}`);
  const rot = ((r() - 0.5) * 10).toFixed(1);
  const g = sv('g', { transform: `rotate(${rot} ${cx} ${cy})` });
  const h = size / 2;
  const corners: Pt[] = [
    [cx - h, cy - h],
    [cx + h, cy - h],
    [cx + h, cy + h],
    [cx - h, cy + h],
  ];
  g.append(
    sv('path', {
      d: scrawl(corners, `frame-${ev.id}`, 4, true),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': '5',
      'stroke-linejoin': 'round',
      opacity: '0.9',
    }),
  );
  const inset = h * 0.82;
  const inner: Pt[] = [
    [cx - inset, cy - inset],
    [cx + inset, cy - inset],
    [cx + inset, cy + inset],
    [cx - inset, cy + inset],
  ];
  g.append(
    sv('path', {
      d: scrawl(inner, `frame-in-${ev.id}`, 3, true),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': '1.7',
      opacity: '0.55',
    }),
  );
  txt(g, cx, cy + size * 0.19, ev.kanji, { size: size * 0.52, color: 'var(--shu)' });
  // press patchiness — paper-coloured speckle where the seal missed its ink
  stipple(g, corners, {
    seed: `press-${ev.id}`,
    step: 11,
    prob: 0.3,
    r: 1.5,
    color: pageFill,
    opacity: 0.85,
  });
  tip(g, `R${ev.rung} — ${ev.name}. ${ev.note}`);
  parent.append(g);

  // the ledger hand around the impression: rung tag, name, date, one flourish
  txt(parent, cx - h, cy - h - 12, `R${ev.rung}`, {
    size: 11,
    color: 'var(--ink-faint)',
    font: 'body',
    anchor: 'start',
  });
  txt(parent, cx, cy + h + 36, ev.name, { size: 15.5, color: 'var(--ink)', font: 'body' });
  txt(parent, cx, cy + h + 57, `${ev.seasonKanji} ${ev.season} · day ${ev.day}`, {
    size: 12,
    color: 'var(--ink-soft)',
    font: 'body',
  });
  const fy = cy + h + 74;
  const fr = rng(`flourish-${ev.id}`);
  brushStroke(
    parent,
    [
      [cx - 34 - fr() * 14, fy + (fr() - 0.5) * 6],
      [cx + (fr() - 0.5) * 10, fy - 3 - fr() * 4],
      [cx + 34 + fr() * 14, fy + (fr() - 0.5) * 6],
    ],
    { seed: `flourish-${ev.id}`, w: 2.4, color: 'var(--ink-soft)', opacity: 0.6, dry: true },
  );
}

// ── the thread ────────────────────────────────────────────────────────────────

interface ThreadStretch {
  readonly pts: readonly Pt[];
  readonly w: number;
  readonly color: string;
  readonly dry: boolean;
  /** hover-title anchor for a knot/lean mark */
  readonly mark?: { x: number; y: number; label: string };
}

/** One inter-stamp stretch of the thread — seeded sway, a knot loop where the
 *  run knotted, thin dry ink through a lean stretch. */
function buildStretch(from: Pt, to: Pt, seed: string, knotAt?: Pt): readonly Pt[] {
  const r = rng(seed);
  const at = (t: number): Pt => [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t + (r() - 0.5) * 64,
  ];
  const pts: Pt[] = [from, at(0.26)];
  if (knotAt) {
    // the stroke loops over ITSELF: enter from travel-side (east — the run reads
    // right → left), circle once-and-a-bit so it self-crosses, exit westward
    const rad = 11 + r() * 4;
    for (let k = 0; k <= 10; k++) {
      const a = (k / 10) * Math.PI * 2.3;
      pts.push([knotAt[0] + Math.cos(a) * rad, knotAt[1] + Math.sin(a) * rad * 0.85]);
    }
  } else {
    pts.push(at(0.54));
  }
  pts.push(at(0.8), to);
  return pts;
}

function paintThread(parent: SVGElement, anchors: readonly Pt[]): readonly ThreadStretch[] {
  const stretches: ThreadStretch[] = [];
  for (let i = 0; i < STAMPS.length; i++) {
    const ev = STAMPS[i]!;
    const from = anchors[i]!;
    const to = anchors[i + 1]!;
    const mark = THREAD_MARKS.find((m) => m.beforeRung === ev.rung);
    const r = rng(`mark-${ev.id}`);
    const knotAt: Pt | undefined =
      mark?.kind === 'knot'
        ? [
            from[0] + (to[0] - from[0]) * (0.45 + r() * 0.14),
            // the knot sits ON the thread's course, not beside it
            from[1] + (to[1] - from[1]) * 0.5 + (r() - 0.5) * 16,
          ]
        : undefined;
    const pts = buildStretch(from, to, `thread-${ev.id}`, knotAt);
    const lean = mark?.kind === 'lean';
    const markAt = knotAt ?? (lean ? pts[2]! : undefined);
    stretches.push({
      pts,
      w: lean ? 1.7 : knotAt ? 5 : 4.2,
      color: knotAt ? 'var(--ink)' : 'var(--ink-soft)',
      dry: lean,
      ...(mark && markAt ? { mark: { x: markAt[0], y: markAt[1], label: mark.label } } : {}),
    });
  }
  // the tail — the run continues past the last seal, dry off the page edge
  const last = anchors[STAMPS.length]!;
  const rt = rng('thread-tail');
  stretches.push({
    pts: [last, [last[0] - 110, last[1] - 18 - rt() * 30], [last[0] - 220, last[1] - 30]],
    w: 3.4,
    color: 'var(--ink-soft)',
    dry: true,
  });
  for (const [i, s] of stretches.entries()) {
    brushStroke(parent, s.pts, {
      seed: `ink-${s.pts[0]![0].toFixed(0)}-${s.pts[0]![1].toFixed(0)}`,
      w: s.w,
      color: s.color,
      opacity: 0.85,
      // the first stretch leaves the cover softly; joints hide under the seals
      taperIn: i === 0 ? 0.22 : 0.08,
      taperOut: 0.08,
      dry: s.dry,
    });
  }
  return stretches;
}

// ── the book ──────────────────────────────────────────────────────────────────

let uidCounter = 0;

function paintBook(svg: SVGSVGElement): void {
  const uid = `sbk-${++uidCounter}`;
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
      seed: '11',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '3' }),
  );
  defs.append(filter);
  svg.append(defs);
  const art = sv('g', { filter: `url(#${uid}-w)` });
  const crisp = sv('g');
  svg.append(art, crisp);

  // the accordion panels — alternating washi shades, hand-cut edges
  const pageFills: string[] = [];
  for (let s = 0; s < PAGES; s++) {
    const x0 = pageX(s);
    const fill = s % 2 === 0 ? 'var(--washi)' : 'var(--washi-shade)';
    pageFills[s] = fill;
    wash(
      art,
      [
        [x0 + 7, 7],
        [x0 + PAGE_W - 7, 7],
        [x0 + PAGE_W - 7, PAGE_H - 7],
        [x0 + 7, PAGE_H - 7],
      ],
      { seed: `page-${s}`, fill, amp: 3 },
    );
  }
  // fold creases between panels
  for (let s = 1; s < PAGES; s++) {
    const x = pageX(s - 1);
    inkLine(
      art,
      [
        [x, 12],
        [x, PAGE_H - 12],
      ],
      { seed: `crease-${s}`, color: 'var(--steel-0)', w: 2.4, opacity: 0.9, amp: 1.2 },
    );
  }

  // the cover (rightmost panel): title, owner, and the thread's starting end
  const coverCx = pageX(0) + PAGE_W / 2;
  txt(art, coverCx, 120, '朱印帳', { size: 46, color: 'var(--ink)', vertical: true });
  txt(art, coverCx + 58, 240, OWNER.kanji, {
    size: 20,
    color: 'var(--ink-soft)',
    vertical: true,
  });
  txt(art, coverCx, PAGE_H - 52, `the stamp book of ${OWNER.roman}`, {
    size: 12,
    color: 'var(--ink-soft)',
    font: 'body',
  });

  // stamp anchors — seeded heights in a mid band, one per page, right → left
  const anchors: Pt[] = [[coverCx, 445]];
  const sizes: number[] = [];
  for (let i = 0; i < STAMPS.length; i++) {
    const r = rng(`pos-${STAMPS[i]!.id}`);
    const cx = pageX(i + 1) + PAGE_W / 2 + (r() - 0.5) * 24;
    const cy = 236 + r() * 92;
    anchors.push([cx, cy]);
    sizes.push(148 + r() * 20);
  }

  // thread first (behind), stamps pressed over their joints
  const stretches = paintThread(art, anchors);
  for (let i = 0; i < STAMPS.length; i++) {
    const [cx, cy] = anchors[i + 1]!;
    pressStamp(art, cx, cy, sizes[i]!, STAMPS[i]!, pageFills[i + 1]!);
  }

  // crisp hover targets for the thread's marks (TST4 — the knot answers "what
  // happened here" on hover)
  for (const s of stretches) {
    if (!s.mark) continue;
    const hot = sv('circle', {
      cx: s.mark.x.toFixed(1),
      cy: s.mark.y.toFixed(1),
      r: '26',
      fill: 'transparent',
    });
    tip(hot, s.mark.label);
    crisp.append(hot);
  }

  // the sheet border — crisp, outside the wobble
  crisp.append(
    sv('rect', {
      x: '2',
      y: '2',
      width: String(BOOK_W - 4),
      height: String(PAGE_H - 4),
      fill: 'none',
      stroke: 'var(--silver-faint)',
    }),
  );
}

// ── the modal ─────────────────────────────────────────────────────────────────

const CSS = `
  .sbk-card { max-width:none; width:100%; height:calc(100dvh - 2rem); overflow:hidden;
    display:flex; flex-direction:column; }
  .sbk-scroll { flex:1 1 auto; min-height:0; margin-top:.7rem; overflow-x:auto;
    overflow-y:hidden; border:1px solid var(--silver-faint); background:var(--void); }
  .sbk-scroll svg { display:block; height:100%; }
  .sbk-hint { flex:0 0 auto; font-size:11px; color:var(--ink-faint); margin-top:.4rem; }
`;

/** Open the E3 stamp-book prototype as a full-screen DEV modal. Returns the scrim. */
export function openStampBook(): HTMLElement {
  const scrim = hd('div', 'modal-scrim');
  // above the DEV panel (z-index 9999), same as the map review sheets
  scrim.style.zIndex = '10000';
  const card = hd('div', 'modal-card frame sbk-card');
  scrim.append(card);

  const style = document.createElement('style');
  style.textContent = CSS;
  card.append(style);

  const close = hd('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the stamp book');
  card.append(close);

  const title = hd('div', 'modal-title');
  title.append(
    hd('span', 'kami', '朱印帳'),
    hd(
      'span',
      'roman',
      'E3 prototype — the stamp book & ink thread (fixture run · reads right → left)',
    ),
  );
  card.append(title);

  const scroll = hd('div', 'sbk-scroll');
  const svg = sv('svg', {
    viewBox: `0 0 ${BOOK_W} ${PAGE_H}`,
    width: String(BOOK_W),
    height: String(PAGE_H),
    preserveAspectRatio: 'xMinYMin meet',
  }) as SVGSVGElement;
  svg.style.height = '100%';
  svg.style.width = 'auto';
  paintBook(svg);
  scroll.append(svg);
  card.append(scroll);
  card.append(
    hd(
      'div',
      'sbk-hint',
      'One seal per rung ceremony, strung on the run’s ink thread — knots where it ' +
        'knotted (hover them), thin dry ink through the lean weeks. Scroll ⇄ with the ' +
        'wheel. DEV-only prototype from a fixture history; zero game integration.',
    ),
  );

  scroll.addEventListener(
    'wheel',
    (e) => {
      if (e.deltaY !== 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scroll.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    },
    { passive: false },
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
  // a shuinchō opens at its cover — the right end
  scroll.scrollLeft = scroll.scrollWidth;
  return scrim;
}

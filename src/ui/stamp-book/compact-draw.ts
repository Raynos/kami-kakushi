// stamp-book/compact-draw.ts — SHARED drawing for the compact seal-strip
// (ADR-201): the seal impression, the awaiting/next frame, the mystery
// silhouette, the small thread stretch, and the ONE per-seal inspect popover
// every variant uses (P2 — one primitive per idiom, no per-variant forks).
// Quarried from the retired full-screen prototype's craft (book.ts) and
// scaled to the ≤20%-screen register. Seeded-deterministic per seal id
// (TST2 — a repaint never re-jitters).
//
// ADR-139 note: everything the popover says is a MECHANICAL label or a
// registry fact (title, kanji, granter name, season/day). The book's
// "what it remembers" prose lines are a deferred narrative-diverge unit —
// no fiction-voiced text is freehanded here.

import {
  brushStroke,
  rng,
  scrawl,
  stipple,
  sv,
  tip,
} from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';
import { SEASON_TAG } from '../render';
import type { SealSlot, ThreadStretch } from './from-state';

/** Ink text with a choosable register (mirrors the proto's txt helper). */
export function sealText(
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

/** Press one small rung seal: hand-rotated vermillion scrawl frame, the carved
 *  rank glyph, press-patchiness eating into the ink. `id` seeds every jitter. */
export function drawSeal(
  parent: SVGElement,
  cx: number,
  cy: number,
  size: number,
  id: string,
  kanji: string,
  ground = 'var(--washi)',
): SVGGElement {
  const r = rng(`sbc-${id}`);
  const rot = ((r() - 0.5) * 9).toFixed(1);
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
      d: scrawl(corners, `sbc-frame-${id}`, 2.6, true),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': (size * 0.075).toFixed(1),
      'stroke-linejoin': 'round',
      opacity: '0.9',
    }),
  );
  const inset = h * 0.8;
  const inner: Pt[] = [
    [cx - inset, cy - inset],
    [cx + inset, cy - inset],
    [cx + inset, cy + inset],
    [cx - inset, cy + inset],
  ];
  g.append(
    sv('path', {
      d: scrawl(inner, `sbc-frame-in-${id}`, 2, true),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': '1.1',
      opacity: '0.5',
    }),
  );
  // the carved glyph — rank kanji are 2 chars (日雇): stack them vertically,
  // the way a real seal carves its columns.
  const two = kanji.length > 1;
  sealText(g, cx, cy + (two ? -size * 0.34 : size * 0.18), kanji, {
    size: size * (two ? 0.36 : 0.52),
    color: 'var(--shu)',
    ...(two ? { vertical: true } : {}),
  });
  stipple(g, corners, {
    seed: `sbc-press-${id}`,
    step: 7,
    prob: 0.3,
    r: 1.1,
    color: ground,
    opacity: 0.85,
  });
  parent.append(g);
  return g;
}

/** The NEXT slot's awaiting frame — a faint vermillion square, empty, the
 *  press it is waiting for. Named (title drawn by the caller). */
export function drawAwaitFrame(
  parent: SVGElement,
  cx: number,
  cy: number,
  size: number,
  id: string,
): void {
  const h = size / 2;
  const corners: Pt[] = [
    [cx - h, cy - h],
    [cx + h, cy - h],
    [cx + h, cy + h],
    [cx - h, cy + h],
  ];
  parent.append(
    sv('path', {
      d: scrawl(corners, `sbc-await-${id}`, 2.6, true),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': '1.6',
      'stroke-dasharray': '5 4',
      opacity: '0.45',
    }),
  );
}

/** A MYSTERY slot — the blank ghost of a seal not yet within reach
 *  (ruling 5): a faint ink silhouette, no identity. */
export function drawSilhouette(
  parent: SVGElement,
  cx: number,
  cy: number,
  size: number,
  id: string,
): void {
  const h = size / 2;
  const corners: Pt[] = [
    [cx - h, cy - h],
    [cx + h, cy - h],
    [cx + h, cy + h],
    [cx - h, cy + h],
  ];
  parent.append(
    sv('path', {
      d: scrawl(corners, `sbc-ghost-${id}`, 3, true),
      fill: 'var(--steel-0)',
      'fill-opacity': '0.5',
      stroke: 'var(--ink-faint)',
      'stroke-width': '1',
      opacity: '0.5',
    }),
  );
}

/** One inter-seal thread stretch, compact scale: seeded sway, a small knot
 *  loop per recorded fall (capped at 3 drawn loops), thin dry ink when lean.
 *  Hover on a knotted stretch answers "what happened here" (TST4). */
export function drawStretch(
  parent: SVGElement,
  from: Pt,
  to: Pt,
  seed: string,
  s: ThreadStretch,
): void {
  const r = rng(`sbc-th-${seed}`);
  const at = (t: number): Pt => [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t + (r() - 0.5) * 18,
  ];
  const pts: Pt[] = [from, at(0.3)];
  const loops = Math.min(s.knots, 3);
  if (loops > 0) {
    for (let n = 0; n < loops; n++) {
      const c = at(0.42 + n * 0.14);
      const rad = 4.5 + r() * 2;
      for (let k = 0; k <= 8; k++) {
        const a = (k / 8) * Math.PI * 2.3;
        pts.push([c[0] + Math.cos(a) * rad, c[1] + Math.sin(a) * rad * 0.85]);
      }
    }
  } else {
    pts.push(at(0.55));
  }
  pts.push(at(0.82), to);
  brushStroke(parent, pts, {
    seed: `sbc-ink-${seed}`,
    w: s.lean ? 1.1 : s.knots > 0 ? 2.6 : 2.2,
    color: s.knots > 0 ? 'var(--ink)' : 'var(--ink-soft)',
    opacity: 0.85,
    taperIn: 0.1,
    taperOut: 0.1,
    dry: s.lean,
  });
  if (s.knots > 0) {
    const mid = at(0.5);
    const hot = sv('circle', {
      cx: mid[0].toFixed(1),
      cy: mid[1].toFixed(1),
      r: '14',
      fill: 'transparent',
    });
    tip(hot, `${s.knots} fall${s.knots === 1 ? '' : 's'} on this stretch`);
    parent.append(hot);
  }
}

// ── the ONE inspect popover (ruling 4) ────────────────────────────────────────

/** Open the per-seal inspect popover inside `host` (the section card —
 *  position:relative via CSS). One at a time; outside-click/Esc dismisses.
 *  `at` is in host-local px. Registry facts + mechanical labels only. */
export function openSealPopover(
  host: HTMLElement,
  slot: SealSlot,
  at: { x: number; y: number },
  knotsInto?: number,
  markEl?: Element,
): void {
  closeSealPopover(host);
  if (slot.state === 'future') return; // a mystery slot has nothing to say
  markEl?.classList.add('sbc-inspected'); // P17 — the inspected seal reads inspected
  const pop = document.createElement('div');
  pop.className = 'sbc-pop frame';
  const head = document.createElement('div');
  head.className = 'sbc-pop-head';
  const seal = document.createElement('span');
  seal.className = 'sbc-pop-kanji';
  seal.textContent = slot.kanji ?? '';
  head.append(seal);
  const title = document.createElement('span');
  title.className = 'sbc-pop-title';
  title.textContent = slot.title ?? '';
  head.append(title);
  pop.append(head);
  const row = (text: string, cls = ''): void => {
    const d = document.createElement('div');
    d.className = `sbc-pop-row${cls ? ` ${cls}` : ''}`;
    d.textContent = text;
    pop.append(d);
  };
  if (slot.state === 'pressed') {
    if (slot.granter !== undefined) row(`pressed by ${slot.granter}`);
    if (slot.day !== undefined && slot.season !== undefined) {
      const s = SEASON_TAG[slot.season];
      row(`${s.name} ${s.kanji} · day ${slot.day}`);
    } else {
      row('date unrecorded', 'sbc-pop-faint');
    }
    if (knotsInto !== undefined && knotsInto > 0)
      row(`${knotsInto} fall${knotsInto === 1 ? '' : 's'} on the way here`);
  } else {
    // the NEXT seal — what it will take (TST4), from the requirements engine
    row(
      `the next seal — ${slot.reqsDone ?? 0} of ${slot.reqsTotal ?? 0} requirements met`,
    );
  }
  host.append(pop);
  // clamp inside the host
  const hw = host.clientWidth;
  const pw = Math.min(230, hw - 12);
  pop.style.width = `${pw}px`;
  pop.style.left = `${Math.max(6, Math.min(at.x - pw / 2, hw - pw - 6))}px`;
  pop.style.top = `${Math.max(6, at.y)}px`;

  const dismiss = (e: Event): void => {
    if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
    if (e instanceof MouseEvent && pop.contains(e.target as Node)) return;
    closeSealPopover(host);
  };
  // registered on the NEXT tick so the opening click doesn't self-dismiss
  setTimeout(() => {
    document.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss);
  }, 0);
  (pop as HTMLElement & { __dispose?: () => void }).__dispose = () => {
    document.removeEventListener('click', dismiss);
    document.removeEventListener('keydown', dismiss);
  };
}

export function closeSealPopover(host: HTMLElement): void {
  for (const p of Array.from(host.querySelectorAll('.sbc-pop'))) {
    (p as HTMLElement & { __dispose?: () => void }).__dispose?.();
    p.remove();
  }
  for (const m of Array.from(host.querySelectorAll('.sbc-inspected')))
    m.classList.remove('sbc-inspected');
}

/** The repaint key (P4): derived from the STRIP DATA, so the strip repaints
 *  ONLY when something it draws changed (a press, a fall, a requirement
 *  completing on the next slot) — idle ticks churn nothing. */
export function stripKey(data: {
  slots: readonly SealSlot[];
  stretches: readonly ThreadStretch[];
}): string {
  return (
    data.slots
      .map((s) => `${s.state[0]}${s.day ?? ''}.${s.reqsDone ?? ''}`)
      .join('|') +
    '#' +
    data.stretches.map((t) => `${t.knots}${t.lean ? 'L' : ''}`).join('|')
  );
}

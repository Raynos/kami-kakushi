// stamp-book/pages.ts — VARIANT C (DEV-only alternate): the book as an OBJECT
// — a small open shuinchō lying on the surface, two pages visible at once
// (an older press on the right, the way the book reads; the frontier on the
// left), page-edge stacks hinting at what is folded away, ‹ › leafing.
// Distinct APPROACH from A/B: depth by leafing instead of panorama/grid;
// motion is the variant's signature. Fixed frame (P5); the leaf repaints in
// place. Seeded-deterministic (TST2).

import { inkLine, sv, wash } from '../map-sheets/brush';
import {
  drawAwaitFrame,
  drawSeal,
  drawSilhouette,
  drawStretch,
  openSealPopover,
  sealText,
} from './compact-draw';
import type { SealSlot, StripData } from './from-state';

const W = 360;
const H = 164;
const PAGE_W = 150;
const SEAL_SIZE = 62;
const SEAL_CY = 66;

/** Per-host leaf cursor (the RIGHT page's slot index). Keyed weakly so the
 *  live surface and the Review-tab preview never fight over one cursor. */
const cursors = new WeakMap<HTMLElement, number>();

export function paintPages(host: HTMLElement, data: StripData): void {
  const total = data.slots.length;
  const lastPressed = data.slots.reduce(
    (acc, s, i) => (s.state === 'pressed' ? i : acc),
    0,
  );
  // default opening: the frontier spread — last press right, next slot left
  const stored = cursors.get(host);
  const right = Math.max(0, Math.min(stored ?? lastPressed, total - 2));
  cursors.set(host, right);
  host.textContent = '';

  const frame = document.createElement('div');
  frame.className = 'sbc-pages';
  host.append(frame);

  const svg = sv('svg', {
    viewBox: `0 0 ${W} ${H}`,
    class: 'sbc-pages-svg',
  }) as SVGSVGElement;
  frame.append(svg);

  // the closed folds stacked at each side — how much lies beyond each edge
  const foldedRight = right; // older pages folded under the right edge
  const foldedLeft = total - 2 - right; // yet-unseen pages beyond the left
  for (let k = 0; k < Math.min(foldedRight, 4); k++) {
    inkLine(
      svg,
      [
        [W - 8 - k * 4, 16 + k * 2],
        [W - 8 - k * 4, H - 16 - k * 2],
      ],
      { seed: `sbp-edge-r-${k}`, color: 'var(--steel-0)', w: 2, opacity: 0.8 },
    );
  }
  for (let k = 0; k < Math.min(foldedLeft, 4); k++) {
    inkLine(
      svg,
      [
        [8 + k * 4, 16 + k * 2],
        [8 + k * 4, H - 16 - k * 2],
      ],
      { seed: `sbp-edge-l-${k}`, color: 'var(--steel-0)', w: 2, opacity: 0.8 },
    );
  }

  // the two open pages + the spine crease
  const pageL = W / 2 - PAGE_W;
  const pages: Array<{ x0: number; slot: SealSlot; idx: number }> = [
    { x0: W / 2, slot: data.slots[right]!, idx: right }, // right page = older
    { x0: pageL, slot: data.slots[right + 1]!, idx: right + 1 }, // left = newer
  ];
  for (const [pi, p] of pages.entries()) {
    wash(
      svg,
      [
        [p.x0 + 3, 6],
        [p.x0 + PAGE_W - 3, 6],
        [p.x0 + PAGE_W - 3, H - 6],
        [p.x0 + 3, H - 6],
      ],
      {
        seed: `sbp-page-${pi}`,
        fill: pi === 0 ? 'var(--washi)' : 'var(--washi-shade)',
        amp: 2,
      },
    );
  }
  inkLine(
    svg,
    [
      [W / 2, 9],
      [W / 2, H - 9],
    ],
    {
      seed: 'sbp-spine',
      color: 'var(--steel-0)',
      w: 2.2,
      opacity: 0.9,
      amp: 0.8,
    },
  );

  // the thread crosses the spread through both seal anchors (right → left),
  // carrying the stretch between them (knots/lean live on the LEFT slot's
  // approach — stretches[right]).
  const anchors: Array<[number, number]> = [
    [W / 2 + PAGE_W / 2, SEAL_CY],
    [pageL + PAGE_W / 2, SEAL_CY],
  ];
  const rightSlot = pages[0]!.slot;
  const leftSlot = pages[1]!.slot;
  if (rightSlot.state === 'pressed')
    drawStretch(
      svg,
      [W - 6, SEAL_CY + 10],
      anchors[0]!,
      `sbp-in-${rightSlot.rung}`,
      { knots: 0, lean: false },
    );
  if (rightSlot.state === 'pressed' && leftSlot.state !== 'future')
    drawStretch(
      svg,
      anchors[0]!,
      anchors[1]!,
      `sbp-${rightSlot.rung}`,
      leftSlot.state === 'next'
        ? { ...data.stretches[right]!, lean: true } // the open reach is dry
        : data.stretches[right]!,
    );

  for (const [pi, p] of pages.entries()) {
    const [cx, cy] = anchors[pi]!;
    const slot = p.slot;
    const ground = pi === 0 ? 'var(--washi)' : 'var(--washi-shade)';
    if (slot.state === 'pressed') {
      drawSeal(
        svg,
        cx,
        cy,
        SEAL_SIZE,
        `pg-${slot.rung}`,
        slot.kanji ?? '',
        ground,
      );
      sealText(svg, cx, cy + SEAL_SIZE / 2 + 22, slot.title ?? '', {
        size: 11.5,
        color: 'var(--ink)',
        font: 'body',
      });
      if (slot.day !== undefined)
        sealText(svg, cx, cy + SEAL_SIZE / 2 + 38, `day ${slot.day}`, {
          size: 9.5,
          color: 'var(--ink-soft)',
          font: 'body',
        });
    } else if (slot.state === 'next') {
      drawAwaitFrame(svg, cx, cy, SEAL_SIZE, `pg-${slot.rung}`);
      sealText(svg, cx, cy + SEAL_SIZE / 2 + 22, slot.title ?? '', {
        size: 11.5,
        color: 'var(--ink-soft)',
        font: 'body',
      });
      sealText(
        svg,
        cx,
        cy + SEAL_SIZE / 2 + 38,
        `${slot.reqsDone ?? 0} of ${slot.reqsTotal ?? 0}`,
        // --ink-soft, not --ink-faint: the count is load-bearing (blind pass)
        { size: 9.5, color: 'var(--ink-soft)', font: 'body' },
      );
    } else {
      drawSilhouette(svg, cx, cy, SEAL_SIZE * 0.8, `pg-${slot.rung}`);
    }
    if (slot.state !== 'future') {
      const hot = sv('rect', {
        x: String(p.x0),
        y: '0',
        width: String(PAGE_W),
        height: String(H),
        fill: 'transparent',
        class: 'sbc-hot',
      });
      hot.addEventListener('click', (e) => {
        const hostBox = host.getBoundingClientRect();
        const me = e as MouseEvent;
        openSealPopover(
          host,
          slot,
          { x: me.clientX - hostBox.left, y: me.clientY - hostBox.top + 10 },
          p.idx > 0 ? data.stretches[p.idx - 1]!.knots : undefined,
          hot,
        );
      });
      svg.append(hot);
    }
  }

  // leafing — ‹ toward the frontier, › back toward the cover (right → left)
  const leaf = document.createElement('div');
  leaf.className = 'sbc-leaf';
  const mk = (label: string, delta: number, title: string): void => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'auto-toggle sbc-leaf-btn';
    b.textContent = label;
    b.title = title;
    const target = right + delta;
    b.disabled = target < 0 || target > total - 2;
    b.addEventListener('click', () => {
      cursors.set(host, target);
      paintPages(host, data);
    });
    leaf.append(b);
  };
  mk('›', -1, 'leaf back toward the cover');
  mk('‹', 1, 'leaf on toward the frontier');
  frame.append(leaf);
}
